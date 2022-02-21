import { Collection } from 'mongodb'
import { ServiceError } from '../error'
import { Section, SectionKeyRegex, SectionStatus } from '../models/section'
import { SectionPage } from '../scrapers/pages/section'
import { parseSectionStatus } from '../scrapers/parsers/section-status'
import { ServiceResult } from '../types/service'

export class SectionStatusServiceBase {
    sections: Collection<Section>
}

export default class SectionStatusService extends SectionStatusServiceBase {
    sections: Collection<Section>

    constructor(props: SectionStatusServiceBase) {
        Object.assign(super(), props)
    }

    async getStatus(sectionKey: string) {
        const sectionCursor = this.sections
            .find({ key: sectionKey })
            .project<{ status: SectionStatus }>({ status: 1 })

        const sectionFields = await sectionCursor.next()

        return sectionFields?.status
    }

    async updateStatus(sectionKey: string): Promise<SectionStatus> {
        if (!sectionKey.match(SectionKeyRegex)) {
            throw new ServiceError({
                code: 'SECTION_NOT_FOUND',
                sectionKey
            })
        }

        const page = new SectionPage(sectionKey)

        const html = await page.retrieveHTML()

        if (!html.match(/expand all classes/i)) {
            throw new ServiceError({
                code: 'SECTION_NOT_FOUND',
                sectionKey
            })
        }

        const updatedStatus = parseSectionStatus(html)

        await this.sections.updateOne(
            {
                key: sectionKey
            },
            {
                $set: {
                    status: updatedStatus
                }
            },
            {
                upsert: true
            }
        )

        return updatedStatus
    }
}

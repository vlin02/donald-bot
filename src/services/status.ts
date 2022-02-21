import { Collection } from 'mongodb'
import { Section, SectionStatus } from '../models/section'
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

    async updateStatus(sectionKey: string): Promise<
        ServiceResult<
            {
                status: SectionStatus
            },
            'SECTION_NOT_FOUND'
        >
    > {
        const page = new SectionPage(sectionKey)
        const html = await page.retrieveHTML()

        if (!html.match(/expand all classes/i)) {
            return {
                response: 'error',
                payload: {
                    code: 'SECTION_NOT_FOUND',
                    sectionKey
                }
            }
        }

        const updatedStatus = parseSectionStatus(html)

        await this.sections.updateOne(
            {
                key: sectionKey
            },
            {
                status: updatedStatus
            },
            {
                upsert: true
            }
        )

        return {
            response: 'success',
            payload: {
                status: updatedStatus
            }
        }
    }
}

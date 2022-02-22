import { db } from '../../loaders/database'
import { SectionDocument } from './document'
import { SectionStatus } from '@/scraper/ucla/models/status'

export class Section extends SectionDocument {
    constructor(document: Partial<SectionDocument>) {
        Object.assign(super(), document)
    }

    async updateStatus(status: SectionStatus): Promise<void> {
        await db.sections.updateOne(
            {
                key: this.key
            },
            {
                $set: {
                    status
                }
            }
        )

        this.status
    }
}

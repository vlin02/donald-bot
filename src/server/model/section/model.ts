import { db } from '../../loaders/database'
import { SectionSchema } from './document'
import { SectionStatus } from '@/scraper/ucla/models/status'

export class SectionModel extends SectionSchema {
    constructor(document: SectionSchema) {
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

    static async get(sectionKey: string) {
        const sectionDoc = await db.sections.findOne({
            key: sectionKey
        })

        return sectionDoc && new SectionModel(sectionDoc)
    }

    static async create(section: SectionSchema) {
        await db.sections.insertOne(section)
        return new SectionModel(section)
    }
}

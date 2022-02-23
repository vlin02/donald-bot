import { SectionStatus } from '@donald-bot/scraper'
import { db } from '../../loaders/database'
import { SectionSchema } from './document'

export class SectionModel implements SectionSchema {
    readonly key: string
    readonly status: SectionStatus

    constructor(doc: SectionSchema) {
        this.key = doc.key
        this.status = doc.status
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

import { SectionStatus } from '@/scraper/ucla/models/status'
import { db } from '../../loaders/database'
import { Section } from './model'
export class SectionCollection {
    async getSection(sectionKey: string) {
        const doc = await db.sections.findOne({ key: sectionKey })
        return doc && new Section(doc)
    }

    async createSection(doc : {key: string, status: SectionStatus}) {
        await db.sections.insertOne(doc)
        return new Section(doc)
    }
}

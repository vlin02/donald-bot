import { db } from '../../loaders/database'
import { User } from './model'

export interface InsertTicketProps {
    sectionKey: string
}

export class UserCollection {
    async getUser(discordId: string) {
        const doc = await db.users.findOne({
            discordId: discordId
        })

        return doc ? new User(doc) : await this.createUser(discordId)
    }

    async createUser(discordId: string) {
        const doc = {
            discordId: discordId,
            tickets: []
        }

        await db.users.insertOne(doc)
        return new User(doc)
    }
}

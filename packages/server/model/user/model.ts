import { db } from '../../loaders/database'
import { SectionSchema } from '../section/document'
import { SectionModel } from '../section/model'
import { UserSchema } from './schema'

export class UserModel extends UserSchema {
    async insertTicket(sectionKey: string) {
        await db.users.updateOne(
            {
                discordId: this.discordId
            },
            {
                $push: {
                    tickets: sectionKey
                }
            }
        )

        this.tickets.push(sectionKey)
    }

    async getTicketSections() {
        const aggregateResult = await db.users
            .aggregate([
                {
                    $match: {
                        discordId: this.discordId
                    }
                },
                {
                    $project: {
                        tickets: true
                    }
                },
                {
                    $lookup: {
                        from: 'sections',
                        localField: 'tickets',
                        foreignField: 'key',
                        as: 'tickets'
                    }
                }
            ])
            .toArray()

        const sections = aggregateResult[0].tickets as SectionSchema[]
        return sections.map((section) => new SectionModel(section))
    }

    private static fromDocument(doc: UserSchema) {
        const user = new UserModel()
        Object.assign(user, doc)
        return user
    }

    static async get(discordId: string) {
        const userDoc = await db.users.findOne({
            discordId: discordId
        })

        return userDoc && this.fromDocument(userDoc)
    }

    static async create(discordId: string) {
        const userDoc = {
            discordId: discordId,
            tickets: []
        }

        await db.users.insertOne(userDoc)
        return this.fromDocument(userDoc)
    }
}

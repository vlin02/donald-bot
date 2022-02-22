import { db } from '../../loaders/database'
import { UserDocument } from './document'

export class User {
    discordId: string
    tickets: string[]

    constructor(doc: UserDocument) {
        Object.assign(this, doc)
    }

    public async insertTicket({ sectionKey }: { sectionKey: string }): Promise<void> {
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
}

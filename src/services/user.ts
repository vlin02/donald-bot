import { User } from '../models/user'
import { Collection } from 'mongodb'
import TicketService from './ticket'
import SectionStatusService from './status'

export class UserProps {
    users: Collection<User>
}


export interface InsertTicketProps {
    newUser: boolean
    discordId: string
    sectionKey: string
}

export default class UserService extends UserProps {
    constructor(props: UserProps) {
        Object.assign(super(), props)
    }

    public async getUser(discordId: string) {
        return this.users.findOne({
            discordId
        })
    }

    public async insertTicket({ discordId, newUser, sectionKey }: InsertTicketProps): Promise<void> {
        if (!newUser) {
            await this.users.updateOne(
                {
                    discordId
                },
                {
                    $push: {
                        tickets: sectionKey
                    }
                }
            )
        } else {
            await this.users.insertOne({
                discordId,
                tickets: [sectionKey]
            })
        }
    }
}

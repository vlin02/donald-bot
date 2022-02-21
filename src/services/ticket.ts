import { Collection } from 'mongodb'
import { ServiceError } from './error'
import { Database } from '../loaders/database'
import { SectionStatus } from '../models/section'
import { User } from '../models/user'
import { ServiceResult } from '../types/service'
import SectionStatusService from './status'
import UserService from './user'

export class TicketServiceBase {
    userService: UserService
    statusService: SectionStatusService
}

export interface CanRegisterTicketProps {
    user: User
    sectionKey: string
}

export function createTicketService(db: Database) {
    const { users, sections } = db

    return new TicketService({
        userService: new UserService({ users }),
        statusService: new SectionStatusService({ sections })
    })
}

export default class TicketService extends TicketServiceBase {
    users: Collection<User>

    constructor(props: TicketServiceBase) {
        Object.assign(super(), props)
    }

    public async addTicket({ discordId, sectionKey }): Promise<{ status: SectionStatus }> {
        const user = await this.userService.getUser(discordId)
        if (user) await this.validateCanRegisterTicket({ user, sectionKey })

        let currStatus =
            (await this.statusService.getStatus(sectionKey)) ??
            (await this.statusService.updateStatus(sectionKey))

        await this.userService.insertTicket({
            newUser: user === null,
            discordId,
            sectionKey
        })

        return {
            status: currStatus
        }
    }

    private async validateCanRegisterTicket({
        user,
        sectionKey
    }: CanRegisterTicketProps): Promise<void> {
        if (user) {
            if (user.tickets.length > 10)
                throw new ServiceError({
                    code: 'TICKET_LIMIT_REACHED',
                    limit: 10
                })

            if (user.tickets.includes(sectionKey))
                throw new ServiceError({
                    code: 'TICKET_EXISTS',
                    sectionKey
                })
        }
    }
}

import { Collection } from 'mongodb'
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

    public async addTicket({
        discordId,
        sectionKey
    }): Promise<
        ServiceResult<
            { status: SectionStatus },
            'SECTION_NOT_FOUND' | 'TICKET_EXISTS' | 'TICKET_LIMIT_REACHED'
        >
    > {
        const user = await this.userService.getUser(discordId)

        if (user) {
            const result = await this.validateCanRegisterTicket({ user, sectionKey })
            if (result.response === 'error') return result
        }

        let currStatus = await this.statusService.getStatus(sectionKey)

        if (!currStatus) {
            const result = await this.statusService.updateStatus(sectionKey)
            if (result.response === 'error') return result
            currStatus = result.payload.status
        }

        return {
            response: 'success',
            payload: {
                status: currStatus
            }
        }
    }

    private async validateCanRegisterTicket({
        user,
        sectionKey
    }: CanRegisterTicketProps): Promise<
        ServiceResult<null, 'TICKET_LIMIT_REACHED' | 'TICKET_EXISTS'>
    > {
        if (user) {
            if (user.tickets.length > 10)
                return {
                    response: 'error',
                    payload: {
                        code: 'TICKET_LIMIT_REACHED',
                        limit: 10
                    }
                }

            if (user.tickets.includes(sectionKey))
                return {
                    response: 'error',
                    payload: {
                        code: 'TICKET_EXISTS',
                        sectionKey
                    }
                }
        }

        return {
            response: 'success',
            payload: null
        }
    }
}

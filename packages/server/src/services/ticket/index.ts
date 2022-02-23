import { UserModel } from '../../model/user/model'
import { SectionModel } from '../../model/section/model'

import {
    SectionKeyRegex,
    SectionPage,
    parseSectionStatus
} from '@donald-bot/scraper'
import {
    AddTicketProps,
    AddTicketResponse,
    TicketServiceInterface
} from './interface'

export default class TicketService implements TicketServiceInterface {
    public async addTicket({
        discordId,
        sectionKey
    }: AddTicketProps): Promise<AddTicketResponse> {
        let user = await UserModel.get(discordId)

        if (user) {
            if (user.tickets.length > 10)
                return {
                    result: 'error',
                    payload: { code: 'TICKET_LIMIT_REACHED', limit: 10 }
                }

            if (user.tickets.includes(sectionKey))
                return {
                    result: 'error',
                    payload: { code: 'TICKET_EXISTS', sectionKey }
                }
        }

        if (!sectionKey.match(SectionKeyRegex)) {
            return {
                result: 'error',
                payload: { code: 'SECTION_NOT_FOUND', sectionKey }
            }
        }

        let section = await SectionModel.get(sectionKey)

        if (!section) {
            const page = new SectionPage(sectionKey)
            const html = await page.retrieveHTML()

            if (!html.match(/expand all classes/i)) {
                return {
                    result: 'error',
                    payload: { code: 'SECTION_NOT_FOUND', sectionKey }
                }
            }

            const retrievedStatus = parseSectionStatus(html)

            section = await SectionModel.create({
                key: sectionKey,
                status: retrievedStatus
            })
        }

        if (!user) {
            user = await UserModel.create(discordId)
        }

        await user.insertTicket(sectionKey)

        return {
            result: 'success',
            payload: {
                status: section.status
            }
        }
    }
}

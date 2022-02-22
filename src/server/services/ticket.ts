import { ServiceError } from './error'
import { SectionStatus } from '../../scraper/ucla/models/status'
import { SectionKeyRegex, SectionPage } from '../../scraper/ucla/pages/section'
import { parseSectionStatus } from '../../scraper/ucla/parsers/section-status'
import { UserModel } from '../model/user/model'
import { SectionModel } from '../model/section/model'

export interface AddTicketProps {
    discordId: string
    sectionKey: string
}

export default class TicketService {

    public async addTicket({
        discordId,
        sectionKey
    }): Promise<SectionStatus> {
        let user = await UserModel.get(discordId)

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
            
        if (!sectionKey.match(SectionKeyRegex)) {
            throw new ServiceError({
                code: 'SECTION_NOT_FOUND',
                sectionKey
            })
        }
        
        let section = await SectionModel.get(sectionKey)

        if (!section) {
            const page = new SectionPage(sectionKey)
            const html = await page.retrieveHTML()

            if (!html.match(/expand all classes/i)) {
                throw new ServiceError({
                    code: 'SECTION_NOT_FOUND',
                    sectionKey
                })
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

        return section.status
    }
}

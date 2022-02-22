import { ServiceError } from './error'
import { UserCollection } from '../dao/user/collection'
import { SectionStatus } from '../../scraper/ucla/models/status'
import { SectionCollection } from '../dao/section/collection'
import { SectionKeyRegex, SectionPage } from '@/scraper/ucla/pages/section'
import { parseSectionStatus } from '@/scraper/ucla/parsers/section-status'

export interface AddTicketProps {
    discordId: string
    sectionKey: string
}

export default class TicketService {
    users = new UserCollection()
    sections = new SectionCollection()

    public async addTicket({
        discordId,
        sectionKey
    }): Promise<SectionStatus> {
        const user = await this.users.getUser(discordId)

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
            
        if (!sectionKey.match(SectionKeyRegex)) {
            throw new ServiceError({
                code: 'SECTION_NOT_FOUND',
                sectionKey
            })
        }
        
        let section = await this.sections.getSection(sectionKey)

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

            section = await this.sections.createSection({
                key: sectionKey,
                status: retrievedStatus
            })
        }

        await user.insertTicket(sectionKey)

        return section.status
    }
}

import { botClient } from '../client'
import { collections } from '../database'
import * as SectionStatusScraper from '../scrapers/sectionStatus'
import { logger } from '../log'
import { inferSectionAvailability } from '../models/sectionAvailability'

export default async function updateAllTickets() {
    const tickets = (await collections.tickets?.find().toArray()) ?? []
    const ticketBuffer = await Promise.all(
        tickets.map(async (ticket) => {
            return {
                ticket,
                newStatus: await SectionStatusScraper.scrape(ticket.sectionKey)
            }
        })
    )

    logger.log('info', 'retrieved new ticket statuses')

    ticketBuffer.forEach(async ({ ticket, newStatus }) => {
        logger.log('debug', `newStatus: ${JSON.stringify(newStatus)} for section ${ticket.sectionKey}`)
        
        const [oldAction, newAction] = [ticket.status, newStatus].map(
            inferSectionAvailability
        )

        if (oldAction === newAction) return

        const user = await botClient.users.fetch(ticket.userId)

        await user.send(
            `Status update on section ${ticket.sectionKey}: course is now ${newAction.tag}`
        )

        logger.log(
            'info',
            'status update message sent to %s (%s) for section %s',
            user.username,
            user.id,
            ticket.sectionKey
        )
    })
}

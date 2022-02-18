import { botClient } from '../client'
import { collections } from '../database'
import * as SOC from '../scrapers/SOC'
import { logger } from '../log'
import * as SectionAvailability from '../models/SectionAvailability'
import { Ticket } from '../models/Ticket'

type TicketUpdate = {
    ticket: Ticket
    update: Partial<Ticket>
}

export async function getTicketStatusUpdates(tickets: Ticket[]) {
    return Promise.all(
        tickets.map(async (ticket) => {
            const page = new SOC.SectionPage(ticket.sectionKey)
            const html = await page.retrieveHTML()

            return {
                ticket,
                update: {
                    status: SOC.extractSectionStatus(html)
                }
            }
        })
    )
}

export function createTicketUpdateOperation({ ticket, update }: TicketUpdate) {
    return {
        updateOne: {
            filter: {
                userId: ticket.userId,
                sectionKey: ticket.sectionKey
            },
            update: {
                ...ticket,
                ...update
            }
        }
    }
}

export default async function updateAllTickets() {
    const tickets = (await collections.tickets?.find().toArray()) ?? []
    const ticketUpdates = await getTicketStatusUpdates(tickets)

    logger.log('info', 'retrieved new ticket statuses')

    ticketUpdates.forEach(async ({ ticket, update }) => {
        logger.log(
            'debug',
            `updated status: ${JSON.stringify(update.status)} for section ${
                ticket.sectionKey
            }`
        )

        const [oldAction, newAction] = [ticket.status, update.status].map(
            SectionAvailability.getFromStatus
        )

        if (oldAction === newAction) return

        const user = await botClient.users.fetch(ticket.userId)

        await user.send(
            `Status update on section ${ticket.sectionKey}: course is now ${newAction.tag}`
        )

        logger.info(
            'status update message sent to %s (%s) for section %s',
            user.username,
            user.id,
            ticket.sectionKey
        )
    })

    await collections.tickets?.bulkWrite(
        ticketUpdates.map(createTicketUpdateOperation)
    )

    logger.info('updated ticket statuses in database')
}

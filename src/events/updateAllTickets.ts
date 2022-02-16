import { inferSectionAction } from "../utils/section";
import { botClient } from "../client";
import { collections } from "../database";
import * as SectionStatusScraper from '../scrapers/sectionStatus'

export default async function updateAllTickets() {
    const tickets = await collections.tickets?.find().toArray() ?? []
    const ticketBuffer = await Promise.all(tickets.map(async ticket => {
        return {
            ticket,
            newStatus: await SectionStatusScraper.scrape(ticket.sectionKey)
        }
    }))

    console.log('Retrieved new ticket statuses')

    ticketBuffer.forEach(async ({ticket, newStatus}) => {
        const [oldAction, newAction] = [ticket.status, newStatus].map(inferSectionAction)

        if (oldAction === newAction) return

        const user = await botClient.users.fetch(ticket.userId)

        await user.send(`Status update on section ${ticket.sectionKey}: ${newAction.value}`)

        console.log(`Message sent to ${user.username}`)
    })
}

import { Ticket } from '../models/ticket'
import { inferSectionAvailability } from '../scrapers/sectionStatus'

export default function TicketDetail(ticket: Ticket) {
    const { sectionKey, status } = ticket

    const avail = inferSectionAvailability(status)
    const message = [
        `${avail.emote} __**${sectionKey}**__`,
        `Status **${avail.tag.toUpperCase()}**`,
        `Enrolled **${
            status.enroll.size
                ? `${status.enroll.filled}/${status.enroll.size}`
                : 'N/A'
        }**`,
        `Waitlisted **${
            status.waitlist.size
                ? `${status.waitlist.filled}/${status.waitlist.size}`
                : 'N/A'
        }**`
    ]

    return message.join('\n')
}

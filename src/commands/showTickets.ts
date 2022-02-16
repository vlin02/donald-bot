import { inferSectionAction } from '../utils/section'
import { collections } from '../database'
import { CommandHandler } from '../types'

const showTickets: CommandHandler = async (interaction) => {
    await interaction.deferReply()

    const userId = interaction.user.id

    const tickets = await collections.tickets
        ?.find({
            userId
        })
        .toArray() ?? []

    const ticketMessages = tickets.map(
        (ticket) =>
            `${ticket.sectionKey}: ${inferSectionAction(ticket.status).value}`
    )

    const reply = ticketMessages.length ? ticketMessages.join('\n') : 'You have no tickets!'

    interaction.editReply(reply)
}

export default showTickets

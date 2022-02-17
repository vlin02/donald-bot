import { collections } from '../database'
import { CommandHandler } from '../types'
import TicketDetail from '../views/TicketDetail'

const showTickets: CommandHandler = async (interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const userId = interaction.user.id

    const tickets =
        (await collections.tickets
            ?.find({
                userId
            })
            .toArray()) ?? []

    if (tickets.length === 0) {
        interaction.editReply(':tickets: You have no tickets')
        return
    }

    const message = tickets.map(TicketDetail).join('\n\n')
    interaction.editReply(message)
}

export default showTickets

import { SlashCommandBuilder } from '@discordjs/builders'
import { ServiceError } from '../services/error'
import { createTicketService } from '../services/ticket'
import { CommandInteractionHandler } from '../types/discord'
import { multiline } from '../utils/format'
import { buildErrorMessage } from '../views/messages/error'
import { buildSectionStatusMessage } from '../views/messages/section'

const options = new SlashCommandBuilder()
    .setName('add-ticket')
    .setDescription('Add a new tracking ticket')
    .addStringOption((option) =>
        option.setName('section').setDescription('section to track').setRequired(true)
    )

class AddTicketHandler extends CommandInteractionHandler {
    async handle() {
        const { user, options } = this.interaction
        await this.interaction.deferReply({ ephemeral: true })

        const sectionKey = options.getString('section', true).toUpperCase()
        const ticketService = createTicketService(this.db)

        const result = await ticketService
            .addTicket({ discordId: user.id, sectionKey })
            .catch(async (e) => {
                if (e instanceof ServiceError) {
                    const errorMessage = buildErrorMessage({ error: e.payload })
                    await this.interaction.editReply(errorMessage)
                    return null
                }

                throw e
            })

        if (!result) return 
        const {status} = result

        const sectionStatusMessage = buildSectionStatusMessage({ key: sectionKey, status })
        const successMessage = multiline(':tickets: ticket added', sectionStatusMessage)

        await this.interaction.editReply(successMessage)
    }
}

export const addTicketCommand = {
    name: 'add-ticket',
    options,
    handler: AddTicketHandler
}

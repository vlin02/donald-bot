import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteractionHandler } from './discord'
import { multiline } from '../utils/format'
import { buildErrorMessage } from '../views/messages/error'
import { buildSectionStatusMessage } from '../views/messages/section'
import { ServiceError  } from '@donald-bot/server'
import TicketService from '@donald-bot/server/src/services/ticket'

const options = new SlashCommandBuilder()
    .setName('add-ticket')
    .setDescription('Add a new tracking ticket')
    .addStringOption((option) =>
        option.setName('section').setDescription('section to track').setRequired(true)
    )

export class AddTicketHandler extends CommandInteractionHandler {
    async handle() {
        const { user, options } = this.interaction
        await this.interaction.deferReply({ ephemeral: true })

        const sectionKey = options.getString('section', true).toUpperCase()
        const ticketService = new TicketService()

        const status = await ticketService
            .addTicket({ discordId: user.id, sectionKey })
            .catch(async (e) => {
                if (e instanceof ServiceError) {
                    const errorMessage = buildErrorMessage({ error: e.payload })
                    await this.interaction.editReply(errorMessage)
                    return null
                }

                throw e
            })

        if (!status) return 

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

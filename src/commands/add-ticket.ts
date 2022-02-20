import { SlashCommandBuilder } from '@discordjs/builders'
import { InteractionReplyOptions } from 'discord.js'
import { AddTicketService, AddTicketServiceError } from '../services/add-ticket'
import ValidateSectionService from '../services/validate-section'
import { CommandInteractionHandler } from '../utils/types'

const options = new SlashCommandBuilder()
    .setName('add-ticket')
    .setDescription('Add a new tracking ticket')
    .addStringOption((option) =>
        option
            .setName('section')
            .setDescription('section to track')
            .setRequired(true)
    )

class AddTicketHandler extends CommandInteractionHandler {
    async handle(): Promise<boolean> {
        const { user, options } = this.interaction
        let view: InteractionReplyOptions

        const sectionKey = options.getString('section', true)

        const validationResult = ValidateSectionService({
            sectionKey
        })

        if (validationResult.success === false) {
            const { payload } = validationResult
            switch (payload.code) {
                case 'ILLEGAL_SUBJECT_AREA':
                case 'IMPROPER_SECTION_KEY_FORMAT':
                    view = { content: 'section key is invalid' }
            }

            this.reply(view)
            return false
        }

        const addTicketResult = await AddTicketService({
            discordId: user.id,
            sectionKey,
            db: this.db
        })

        if (addTicketResult.success === false) {
            const { payload } = addTicketResult

            switch (payload.code) {
                case 'EXISTING_TICKET_FOUND':
                case 'MAX_TICKET_LIMIT_REACHED':
                case 'SECTION_NOT_FOUND':
                    view = { content: 'unable to add ticket at this time' }
            }

            this.reply(view)
            return false
        } else {
            const { section } = addTicketResult.payload
            this.reply({ content: `ticket added for ${section.key}` })
            return true
        }
    }
}

export const addTicketCommand = {
    name: 'add-ticket',
    options,
    handler: AddTicketHandler
}

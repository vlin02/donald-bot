import { SlashCommandBuilder } from '@discordjs/builders'
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

const handler: CommandInteractionHandler = () => {

}

export const addTicketCommand = {
    name: 'add-ticket',
    options,
    handler
}

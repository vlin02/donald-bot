import { SlashCommandBuilder } from '@discordjs/builders'

export const options = new SlashCommandBuilder()
    .setName('show-tickets')
    .setDescription('Show your tickets')

export const handler = () => {}
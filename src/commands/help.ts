import { SlashCommandBuilder } from '@discordjs/builders'

export const options = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Q/A')

const handler = () => {}
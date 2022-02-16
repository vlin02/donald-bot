import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import * as Dotenv from 'dotenv'

async function main() {
    Dotenv.config()

    const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } =
        process.env

    const commands = [
        new SlashCommandBuilder()
            .setName('add-ticket')
            .setDescription('Add a new tracking ticket')
            .addStringOption((option) =>
                option.setName('section').setDescription('section to track').setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('show-tickets')
            .setDescription('Show your tickets'),
        new SlashCommandBuilder()
            .setName('clear-tickets')
            .setDescription('Clear your tickets')
    ].map((command) => command.toJSON())

    const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN)

    await rest.put(
        Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
        { body: commands }
    )

    console.log('Commands deployed')
}

main()

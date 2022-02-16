import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import 'dotenv/config'

async function main() {

    const { DISCORD_BOT_AUTH_TOKEN, DISCORD_BOT_CLIENT_ID, DISCORD_DEV_GUILD_ID } =
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

    const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_AUTH_TOKEN)

    await rest.put(
        Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, DISCORD_DEV_GUILD_ID),
        { body: commands }
    )

    console.log('Commands deployed')
}

main()

import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import 'dotenv/config'
import { ValueError } from './error'

const { DISCORD_BOT_AUTH_TOKEN, DISCORD_BOT_CLIENT_ID, DISCORD_DEV_GUILD_ID } =
    process.env

const [DEPLOYMENT_LOCATION] = process.argv.slice(2)

function getDeployment(location: string) {
    switch (location) {
        case 'guild':
            return {
                route: Routes.applicationGuildCommands(
                    DISCORD_BOT_CLIENT_ID,
                    DISCORD_DEV_GUILD_ID
                ),
                message: 'donald-bot commands deployed to guild 🚀'
            }
        case 'global':
            return {
                route: Routes.applicationCommands(DISCORD_BOT_CLIENT_ID),
                message: 'donald-bot commands deployed globally 🚀'
            }
        default:
            throw new ValueError(
                `${location} is an invalid deployment location`
            )
    }
}

async function main() {
    const commands = [
        new SlashCommandBuilder()
            .setName('add-ticket')
            .setDescription('Add a new tracking ticket')
            .addStringOption((option) =>
                option
                    .setName('section')
                    .setDescription('section to track')
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('show-tickets')
            .setDescription('Show your tickets'),
        new SlashCommandBuilder()
            .setName('clear-tickets')
            .setDescription('Clear your tickets')
    ].map((command) => command.toJSON())

    const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_AUTH_TOKEN)

    const { route, message } = getDeployment(DEPLOYMENT_LOCATION)

    await rest.put(route, { body: commands })

    console.log(message)
}

main()

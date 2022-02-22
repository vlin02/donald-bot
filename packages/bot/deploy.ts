import 'dotenv/config'

import { REST } from '@discordjs/rest'
import { commands } from './src/commands'
import { Routes } from 'discord-api-types/v9'

const { DISCORD_BOT_AUTH_TOKEN, DISCORD_BOT_CLIENT_ID, DISCORD_DEV_GUILD_ID } =
    process.env

const [DEPLOYMENT_LOCATION] = process.argv.slice(2)

;(async function () {
    const body = commands.map(({ options }) => {
        return options.toJSON()
    })

    const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_AUTH_TOKEN)

    switch (DEPLOYMENT_LOCATION) {
        case 'guild': {
            const routes = Routes.applicationGuildCommands(
                DISCORD_BOT_CLIENT_ID,
                DISCORD_DEV_GUILD_ID
            )

            await rest.put(routes, { body })

            console.log('donald-bot commands deployed to guild 🚀')

            break
        }
        case 'global': {
            const routes = Routes.applicationCommands(DISCORD_BOT_CLIENT_ID)

            await rest.put(routes, { body })

            console.log('donald-bot commands deployed globally 🚀')
            break
        }
        default:
            throw new Error('unknown deployment location')
    }
})()

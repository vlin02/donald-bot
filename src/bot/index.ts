import 'dotenv/config'

import { Client, Intents } from 'discord.js'
import { commands } from './commands'
import { connectToDatabase } from '../server/loaders/database'
import { logger } from '../server/loaders/logger'

const {DISCORD_BOT_AUTH_TOKEN} = process.env

;(async () => {
    const db = await connectToDatabase()

    logger.info('connected to database')

    const client = new Client({
        intents: [Intents.FLAGS.GUILDS]
    })

    client.once('ready', () => {
        console.log('ready')
    })

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            const { commandName } = interaction
            const currentCmd = commands.find(({ name }) => name === commandName)

            if (!currentCmd) {
                interaction.reply('command does not exist')
                logger.error(
                    'unregistered command named %s received',
                    commandName
                )
                return
            }

            logger.info('handling command %s', commandName)
            
            const handler = new currentCmd.handler({ interaction, db })
            await handler.handle()
        }
    })

    await client.login(DISCORD_BOT_AUTH_TOKEN)

    logger.info('logged into discord client')
})()

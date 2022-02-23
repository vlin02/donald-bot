import 'dotenv/config'

import { Client, Intents } from 'discord.js'
import { commands } from './commands'
import { logger } from './loaders/logger'

const { DISCORD_BOT_AUTH_TOKEN } = process.env

async function login() {
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

            const handler = new currentCmd.handler(interaction)
            try {
                await handler.handle()
            } catch (err) {
                logger.error('unknown exception encountered %o', err)
                if (!interaction.replied)
                    interaction.reply(
                        ':x: Something unexpected happened! Donald has recorded this event'
                    )
            }
        }
    })

    await client.login(DISCORD_BOT_AUTH_TOKEN)

    logger.info('logged into discord client')
}

login()

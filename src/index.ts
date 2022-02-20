import { Client, Intents } from 'discord.js'
import { commands } from './commands'
import { connectToDatabase } from './utils/database'
import { logger } from './utils/logger'
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
            await currentCmd.handler(interaction, db)
        }
    })

    await client.login()

    logger.info('logged into discord client')
})()

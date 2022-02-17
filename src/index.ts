import 'dotenv/config'

import addTicket from './commands/addTicket'
import clearTickets from './commands/clearTickets'
import showTickets from './commands/showTickets'
import { CommandHandler } from './types'
import { botClient } from './client'
import updateTickets from './events/updateAllTickets'
import { connectToDatabase } from './database'
import { logger } from './log'

const { STATUS_UPDATE_INTERVAL, DISCORD_BOT_AUTH_TOKEN } = process.env

export async function main() {
    await connectToDatabase()

    await botClient.login(DISCORD_BOT_AUTH_TOKEN)

    logger.log('info', 'logged into bot client')

    const commandHandlers: Record<string, CommandHandler> = {
        'add-ticket': addTicket,
        'clear-tickets': clearTickets,
        'show-tickets': showTickets
    }

    botClient.once('ready', () => {
        setInterval(() => {
            logger.log('info', 'running ticket updates')
            updateTickets()
        }, Number(STATUS_UPDATE_INTERVAL) * 1000)

        logger.log(
            'info',
            'scheduled updateAllTickets event for every %d sec.',
            STATUS_UPDATE_INTERVAL
        )
    })

    botClient.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return

        const { commandName, user } = interaction

        if (!(commandName in commandHandlers)) {
            interaction.reply('Command not found')
            return
        }

        const handler = commandHandlers[commandName]

        logger.log(
            'debug',
            'running "%s" command for user "%s" (%s)',
            commandName,
            user.username,
            user.id
        )

        try {
            await handler(interaction)
        } catch (e) {
            if (!interaction.replied) {
                 interaction.reply(
                    [
                        '❌ **Bot Error**',
                        'An unexpected error has occured and has been logged'
                    ].join('\n')
                )
            }
            logger.log(
                'error',
                'command failed with error "%s"',
                e.message
            )
        }
    })

    logger.log('info', 'listening for commands...')
}

main()

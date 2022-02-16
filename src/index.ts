import 'dotenv/config'

import addTicket from './commands/addTicket'
import clearTickets from './commands/clearTickets'
import showTickets from './commands/showTickets'
import { CommandHandler } from './types'
import { botClient } from './client'
import updateTickets from './events/updateAllTickets'
import { connectToDatabase } from './database'

export async function main() {
    await connectToDatabase()

    console.log('Connected to database')

    const commandHandlers: Record<string, CommandHandler> = {
        'add-ticket': addTicket,
        'clear-tickets': clearTickets,
        'show-tickets': showTickets
    }

    botClient.once('ready', () => {
        setInterval(
            updateTickets,
            Number(process.env.STATUS_UPDATE_INTERVAL) * 1000
        )

        console.log('Ticket updates scheduled')
    })

    botClient.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return

        const { commandName } = interaction

        if (!(commandName in commandHandlers)) {
            interaction.reply('Command not found')
            return
        }

        const handler = commandHandlers[commandName]

        handler(interaction)
    })

    console.log('Listening for commands')
}

main()

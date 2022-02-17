import { collections } from '../database'
import { CommandHandler } from '../types'
import * as SectionStatusScraper from '../scrapers/sectionStatus'
import { ParsingError } from '../error'
import { MongoServerError } from 'mongodb'
import { logger } from '../log'
import TicketDetail from '../views/TicketDetail'
import { Ticket } from '../models/ticket'

const addTicket: CommandHandler = async (interaction) => {
    const { options, user } = interaction

    const sectionName = options.getString('section') as string
    const sectionKey = sectionName.toUpperCase()

    const ticketCount =
        (await collections.tickets?.count({
            userId: user.id
        })) ?? 10

    if (ticketCount >= 10) {
        interaction.reply({
            content: ':x:  You have reached the ticket limit (10)',
            ephemeral: true
        })

        return
    }

    try {
        const status = await SectionStatusScraper.scrape(sectionKey)

        const newTicket: Ticket = {
            userId: user.id,
            sectionKey,
            status
        }

        await collections.tickets?.insertOne(newTicket)

        interaction.reply({
            content: [
                `:tickets: Tracking ticket created`,
                '\n' + TicketDetail(newTicket)
            ].join('\n'),
            ephemeral: true
        })

        logger.log('debug', 'added ticket for section "%s"', sectionKey)
    } catch (e) {
        if (e instanceof ParsingError) {
            interaction.reply({
                content: `:x: **${sectionName}** is not a valid section`,
                ephemeral: true
            })
        } else if (e instanceof MongoServerError) {
            interaction.reply({
                content: `:x: You already have a ticket for **${sectionKey}**`,
                ephemeral: true
            })
        } else {
            throw e
        }

        logger.log('debug', 'failed to add ticket for section "%s"', sectionKey)
    }
}

export default addTicket

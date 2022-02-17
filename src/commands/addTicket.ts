import { collections } from '../database'
import { CommandHandler } from '../types'
import * as SectionStatusScraper from '../scrapers/sectionStatus'
import TicketDetail from '../views/TicketDetail'
import { Ticket } from '../models/ticket'

import subjectAreas from '../data/subjectAreas.json'
import { logger } from '../log'

const subjectAreaNames = subjectAreas.map((subjectArea) => {
    const {value} = subjectArea
    return value.trim()
})

const addTicket: CommandHandler = async (interaction) => {
    const { options, user } = interaction

    const sectionName = options.getString('section') as string
    const sectionKey = sectionName.toUpperCase()

    const result = sectionKey.match(SectionStatusScraper.sectionKeyRegex)

    if (!result) {
        interaction.reply({
            content: `:x: Section **${sectionKey}** is improperly formatted`,
            ephemeral: true
        })

        return
    }

    const subjectArea = result[2]
    if (!subjectAreaNames.includes(subjectArea)) {
        interaction.reply({
            content: `:x: Subject area ${subjectArea} is not valid`,
            ephemeral: true
        })

        return
    }

    const [ticketCount, existingTicket] = await Promise.all([
        collections.tickets?.count({
            userId: user.id
        }),
        collections.tickets?.findOne({
            userId: user.id,
            sectionKey
        })
    ])

    if ((ticketCount ?? 10) >= 10) {
        interaction.reply({
            content: ':x:  You have reached the ticket limit (10)',
            ephemeral: true
        })

        return
    }

    if (existingTicket) {
        interaction.reply({
            content: `:x: You already have a ticket for **${sectionKey}**`,
            ephemeral: true
        })

        return
    }

    const html = await SectionStatusScraper.retrieveHTML(sectionKey)

    if (!html.match(/expand all classes/i)) {
        interaction.reply({
            content: `:x: section **${sectionKey}** could not be found`,
            ephemeral: true
        })

        return
    }

    const status = SectionStatusScraper.parsePageHTML(html)

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

    logger.log('info', 'added ticket for section %s', sectionKey)
}

export default addTicket

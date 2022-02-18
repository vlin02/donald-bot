import { collections } from '../database'
import { CommandHandler } from '../types'
import * as SOC from '../scrapers/SOC'
import TicketDetail from '../views/TicketDetail'
import { Ticket } from '../models/Ticket'

import { logger } from '../log'
import * as SectionKey from '../models/SectionKey'
import * as DiscordUser from '../models/DiscordUser'

const addTicket: CommandHandler = async (interaction) => {
    const { options, user } = interaction

    const sectionName = options.getString('section') as string
    const sectionKey = sectionName.toUpperCase()

    const sectionKeyValid = SectionKey.isValid(sectionKey)

    if (!sectionKeyValid.value) {
        interaction.reply({
            content: sectionKeyValid.message,
            ephemeral: true
        })

        logger.info('add ticket abored - section key is invalid')
        return
    }

    const canAddTicket = await DiscordUser.canAddTicket(user, sectionKey)

    if (!canAddTicket.value) {
        interaction.reply({
            content: canAddTicket.message,
            ephemeral: true
        })

        logger.info('add ticket abored - user not allowed to add ticket')
        return
    }

    const page = new SOC.SectionPage(sectionKey)
    const html = await page.retrieveHTML()

    if (!html.match(/expand all classes/i)) {
        interaction.reply({
            content: `:x: section **${sectionKey}** could not be found`,
            ephemeral: true
        })

        return
    }

    const status = SOC.extractSectionStatus(html)

    const newTicket: Ticket = {
        userId: user.id,
        sectionKey,
        status
    }

    logger.info('adding ticket %s to database', JSON.stringify(newTicket))
    await collections.tickets?.insertOne(newTicket)

    interaction.reply({
        content: [
            `:tickets: Tracking ticket created`,
            '\n' + TicketDetail(newTicket)
        ].join('\n'),
        ephemeral: true
    })

    logger.info('ticket added')
}

export default addTicket

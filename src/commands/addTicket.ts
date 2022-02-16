import { collections } from '../database'
import { CommandHandler } from '../types'
import * as SectionStatusScraper from '../scrapers/sectionStatus'

const addTicket: CommandHandler = async (interaction) => {
    const sectionKey = interaction.options.getString('section') as string

    const userId = interaction.user.id
    const status = await SectionStatusScraper.scrape(sectionKey)

    try {
        collections.tickets?.insertOne({
            userId,
            sectionKey,
            status
        })
    } catch (e) {
        interaction.reply(`You already have a ticket for ${sectionKey}!`)
    }

    interaction.reply(`Ticket tracking ${sectionKey} created`)
}

export default addTicket

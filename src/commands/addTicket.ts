import { collections } from '../database'
import { CommandHandler } from '../types'
import * as SectionStatusScraper from '../scrapers/sectionStatus'
import { ParsingError } from '../error'
import { MongoServerError } from 'mongodb'

const addTicket: CommandHandler = async (interaction) => {
    const sectionName = interaction.options.getString('section') as string
    const sectionKey = sectionName.toUpperCase()

    const userId = interaction.user.id

    try {
        const status = await SectionStatusScraper.scrape(sectionKey)

        await collections.tickets?.insertOne({
            userId,
            sectionKey,
            status
        })

    } catch (e) {
        if (e instanceof ParsingError) {
            interaction.reply(`${sectionName} is not a valid section name`)
        } else if (e instanceof MongoServerError) {
            interaction.reply({content: `You already have a ticket for ${sectionKey}!`, ephemeral: true})
        } else {
            throw(e)
        }

        return
    }

    interaction.reply({content: `Ticket tracking ${sectionKey} created`, ephemeral: true})
}

export default addTicket

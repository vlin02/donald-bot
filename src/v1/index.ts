// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js'
import 'dotenv/config'
import { toIdentifier } from './command'
import { currentSectionAction, sectionAsString } from './status'
import { Session } from './tracker'

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const session = new Session()

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!')
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN)

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    const tracker = session.get(interaction)

    switch (interaction.commandName) {
        case 'track':
            const term = interaction.options.getString('term')
            const course = interaction.options.getString('course')
            const section = interaction.options.getNumber('section')

            if (!(term && course && section)) {
                interaction.reply('Missing options')
                return
            }

            try {
                const identifier = toIdentifier(term, course, section)

                tracker.addSection(identifier)
                interaction.reply(
                    `Added ${sectionAsString(identifier)} to tracked classes`
                )
            } catch (e) {
                interaction.reply(e.message)
            }
            break
        case 'show':
            interaction.reply('Here ya go!')
            tracker.trackedSections.forEach((section) => {
                const { channel } = interaction
                channel?.send(
                    `${sectionAsString(section.identifier)}: ${
                        section.status && currentSectionAction(section.status)
                    }`
                )
            })
            break
        case 'reset':
        default:
            tracker.reset()
            interaction.reply('All classes cleared')
            break
    }
})

import 'dotenv/config'
import * as Discord from 'discord.js'

export const botClient = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS]
})
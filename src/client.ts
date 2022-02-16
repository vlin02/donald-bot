import 'dotenv/config'
import * as Discord from 'discord.js'

export const botClient = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS]
})

botClient.login(process.env.DISCORD_BOT_TOKEN)
import { CacheType, CommandInteraction } from 'discord.js'
import { Database } from './database'

export type CommandInteractionHandler = (
    interaction: CommandInteraction<CacheType>,
    db: Database
) => any
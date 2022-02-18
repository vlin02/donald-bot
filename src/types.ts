import { CommandInteraction, CacheType } from 'discord.js'

export type CommandHandler<T = Promise<void> | void> = (
    interaction: CommandInteraction<CacheType>
) => T

export type ValidationResult =
    | {
          value: false
          message: string
      }
    | {
          value: true
      }

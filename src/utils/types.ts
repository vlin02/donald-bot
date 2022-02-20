import {
    CacheType,
    CommandInteraction,
    InteractionReplyOptions
} from 'discord.js'
import { Database } from './database'

interface CommandInteractionHandlerProps {
    interaction: CommandInteraction<CacheType>
    db: Database
}

export class CommandInteractionHandler {
    protected interaction: CommandInteraction<CacheType>
    protected db: Database

    constructor({ interaction, db }: CommandInteractionHandlerProps) {
        this.interaction = interaction
        this.db = db
    }

    reply(options: InteractionReplyOptions) {
        return this.interaction.reply({ ...options, ephemeral: true })
    }
}

export type ServiceResult<SuccessPayload, ErrorPayload> =
    | {
          success: true
          payload: SuccessPayload
      }
    | {
          success: false
          payload: ErrorPayload
      }

import { CommandInteraction, CacheType } from 'discord.js'
import { Stringable } from '../types/object'

export class CommandInteractionHandler {
    protected interaction: CommandInteraction<CacheType>

    constructor(interaction: CommandInteraction<CacheType>) {
        this.interaction = interaction
    }

    text(message: Stringable) {
        return this.interaction.reply({
            content: String(message),
            ephemeral: true
        })
    }
}

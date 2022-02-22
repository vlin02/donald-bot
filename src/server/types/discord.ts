import { CommandInteraction, CacheType } from "discord.js"
import { Database } from "../loaders/database"
import { Stringable } from "./object"

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

    text(message: Stringable) {
        return this.interaction.reply({ content: String(message), ephemeral: true })
    }
}

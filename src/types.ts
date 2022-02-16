import { CommandInteraction, CacheType } from "discord.js";

export type CommandHandler = (interaction: CommandInteraction<CacheType>) => void
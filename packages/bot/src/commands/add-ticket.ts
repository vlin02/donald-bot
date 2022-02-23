import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteractionHandler } from "./discord"
import { multiline } from "../utils/format"
import { buildErrorMessage } from "../views/messages/error"
import { buildSectionStatusMessage } from "../views/messages/section"
import api from "../api"
import axios from "axios"
import { logger } from "../loaders/logger"

const options = new SlashCommandBuilder()
  .setName("add-ticket")
  .setDescription("Add a new tracking ticket")
  .addStringOption((option) =>
    option
      .setName("section")
      .setDescription("section to track")
      .setRequired(true)
  )

export class AddTicketHandler extends CommandInteractionHandler {
  async handle() {
    const { user, options } = this.interaction
    await this.interaction.deferReply({ ephemeral: true })

    const sectionKey = options.getString("section", true).toUpperCase()

    let message = ""
    try {
      const {
        data: { status }
      } = await api.post(`/user/${user.id}/add-ticket`, {
        sectionKey
      })

      const sectionStatusMessage = buildSectionStatusMessage({
        key: sectionKey,
        status
      })
      
      message = multiline(
        ":tickets: ticket added",
        sectionStatusMessage
      )

    } catch (error) {
      if (!axios.isAxiosError(error)) throw error
      console.log(error)
      message = buildErrorMessage({ error: error?.response?.data })
    }

    await this.interaction.editReply(message)
  }
}

export const addTicketCommand = {
  name: "add-ticket",
  options,
  handler: AddTicketHandler
}

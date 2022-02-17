import { collections } from "../database";
import { CommandHandler } from "../types";

const clearTickets: CommandHandler = async (interaction) => {
    const userId = interaction.user.id

    await collections.tickets?.deleteMany({
        userId
    })

    interaction.reply({content: ':white_check_mark: All tracking tickets cleared', ephemeral: true})
}

export default clearTickets
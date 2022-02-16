import { collections } from "../database";
import { CommandHandler } from "../types";

const clearTickets: CommandHandler = async (interaction) => {
    const userId = interaction.user.id

    await collections.tickets?.deleteMany({
        userId
    })

    interaction.reply('All tracking tickets cleared!')
}

export default clearTickets
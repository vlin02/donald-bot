import { CommandHandler } from '../types'
import { Help } from '../views/Help'

const help: CommandHandler = (interaction) => {
    interaction.reply({
        content: Help,
        ephemeral: true
    })
}

export default help
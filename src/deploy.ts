import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import 'dotenv/config'

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env

const commands = [
    new SlashCommandBuilder()
        .setName('track')
        .setDescription('Track a new class')
        .addStringOption((option) =>
            option
                .setName('term')
                .setDescription(
                    'format: "<2-digit Year><Quarter>" ex. 2022 Spring => 22S, 2021 Fall => 21F'
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('course')
                .setDescription('format: "<Dept> <Catalog #>" ex. COM SCI 35L')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('section')
                .setDescription('format: "<Lec/Sem section #>" ex. Lec 1 => 1')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('reset')
        .setDescription(
            'Remove all classes from tracking & ends tracking session'
        ),
    new SlashCommandBuilder()
        .setName('show')
        .setDescription('Shows all currently tracked classes')
    // new SlashCommandBuilder()
    //     .setName('start')
    //     .setDescription('Start tracking classes'),
    // new SlashCommandBuilder()
    //     .setName('stop')
    //     .setDescription('Stop tracking classes')
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN)

rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), {
    body: commands
})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)

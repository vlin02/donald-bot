declare namespace NodeJS {
    export interface ProcessEnv extends Record<'DISCORD_BOT_TOKEN' | 'DISCORD_CLIENT_ID' | 'DISCORD_GUILD_ID', string> {}
}

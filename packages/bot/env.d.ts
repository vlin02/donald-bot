declare namespace NodeJS {

    export interface ProcessEnv {
        DISCORD_BOT_AUTH_TOKEN: string
        DISCORD_BOT_CLIENT_ID: string
        DISCORD_DEV_GUILD_ID: string
        NODE_ENV: string
        SERVER_BASE_URL: string
        LOG_LEVEL?: string
    }
}

interface BotEnv {
    STATUS_UPDATE_INTERVAL: string
    MONGO_CONN_STRING: string
    MONGO_DB_NAME: string
    DISCORD_BOT_AUTH_TOKEN: string
    DISCORD_BOT_CLIENT_ID: string
    DISCORD_DEV_GUILD_ID: string
    NODE_ENV: string
    LOG_LEVEL: string
}

declare namespace NodeJS {
    export interface ProcessEnv extends BotEnv {}
}

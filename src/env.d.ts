declare namespace NodeJS {
    export interface ProcessEnv
        extends Record<
            | 'DB_CONN_STRING'
            | 'TICKETS_COLLECTION_NAME'
            | 'DISCORD_BOT_TOKEN'
            | 'DISCORD_CLIENT_ID'
            | 'DISCORD_GUILD_ID',
            string
        > {}
}

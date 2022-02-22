interface BotEnv {
    STATUS_UPDATE_INTERVAL: string
    MONGO_CONN_STRING: string
    MONGO_DB_NAME: string
    NODE_ENV: string
    LOG_LEVEL: string
}

declare namespace NodeJS {
    export interface ProcessEnv extends BotEnv {}
}

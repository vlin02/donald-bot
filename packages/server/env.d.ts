declare namespace NodeJS {
    
    export interface ProcessEnv {
        NODE_ENV: string
        PORT: string
    
        MONGO_CONN_STRING: string
        MONGO_DB_NAME: string
    
        STATUS_UPDATE_INTERVAL: string
        LOG_LEVEL: string
    }
}

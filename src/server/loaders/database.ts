import 'dotenv/config'

import { Collection, MongoClient } from 'mongodb'
import { SectionSchema } from '../model/section/document'
import { UserSchema } from '../model/user/schema'
import { logger } from './logger'

const { MONGO_CONN_STRING, MONGO_DB_NAME } = process.env

export interface Database {
    sections: Collection<SectionSchema>
    users: Collection<UserSchema>
}

export let db = {} as Database

export async function connectToDatabase(): Promise<void> {
    const client = new MongoClient(MONGO_CONN_STRING)

    await client.connect()

    const mongoDb = client.db(MONGO_DB_NAME)

    logger.info('using database named %s', mongoDb.databaseName)

    db = {
        sections: mongoDb.collection<SectionSchema>('sections'),
        users: mongoDb.collection<UserSchema>('users')
    }
}

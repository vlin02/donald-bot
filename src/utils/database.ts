import 'dotenv/config'

import { Collection, MongoClient } from 'mongodb'
import { Section } from '../models/section'
import { User } from '../models/user'
import { logger } from './logger'

const { MONGO_CONN_STRING, MONGO_DB_NAME } = process.env

export interface Database {
    sections: Collection<Section>
    users: Collection<User>
}

export async function connectToDatabase(): Promise<Database> {
    const client = new MongoClient(MONGO_CONN_STRING)

    await client.connect()

    const mongoDb = client.db(MONGO_DB_NAME)

    logger.info('using database named %s', mongoDb.databaseName)

    return {
        sections: mongoDb.collection<Section>('sections'),
        users: mongoDb.collection<User>('users')
    }
}

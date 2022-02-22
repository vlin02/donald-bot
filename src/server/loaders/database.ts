import 'dotenv/config'

import { Collection, MongoClient } from 'mongodb'
import { SectionDocument } from '../dao/section/document'
import { UserDocument } from '../dao/user/document'
import { logger } from './logger'

const { MONGO_CONN_STRING, MONGO_DB_NAME } = process.env

export interface Database {
    sections: Collection<SectionDocument>
    users: Collection<UserDocument>
}

export async function connectToDatabase(): Promise<Database> {
    const client = new MongoClient(MONGO_CONN_STRING)

    await client.connect()

    const mongoDb = client.db(MONGO_DB_NAME)

    logger.info('using database named %s', mongoDb.databaseName)

    return {
        sections: mongoDb.collection<SectionDocument>('sections'),
        users: mongoDb.collection<UserDocument>('users')
    }
}

export const db = {} as Database

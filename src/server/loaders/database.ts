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

export let db = {} as Database

export async function connectToDatabase(): Promise<void> {
    const client = new MongoClient(MONGO_CONN_STRING)

    await client.connect()

    const mongoDb = client.db(MONGO_DB_NAME)

    logger.info('using database named %s', mongoDb.databaseName)

    db = {
        sections: mongoDb.collection<SectionDocument>('sections'),
        users: mongoDb.collection<UserDocument>('users')
    }
}

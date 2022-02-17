import 'dotenv/config'

import { MongoClient, Collection } from 'mongodb'
import { Ticket } from './models/ticket'
import { logger } from './log'

const { MONGO_PROD_CONN_STRING, MONGO_DB_NAME } = process.env

export const collections: { tickets?: Collection<Ticket> } = {}

export async function connectToDatabase() {
    const client: MongoClient = new MongoClient(MONGO_PROD_CONN_STRING)

    await client.connect()

    const db = client.db(MONGO_DB_NAME)

    const ticketsCollection = db.collection<Ticket>('tickets')

    collections.tickets = ticketsCollection

    await collections.tickets.createIndex(['userId', 'sectionKey'], {
        unique: true
    })

    logger.log('info', 'connected to database: "%s"', db.databaseName)
}
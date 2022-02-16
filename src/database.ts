import * as mongoDB from 'mongodb'
import * as dotenv from 'dotenv'
import { Ticket } from './models/ticket'

export const collections: { tickets?: mongoDB.Collection<Ticket> } = {}

export async function connectToDatabase() {
    dotenv.config()

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
        process.env.DB_CONN_STRING
    )

    await client.connect()

    const db: mongoDB.Db = client.db(process.env.DB_NAME)

    const ticketsCollection = db.collection<Ticket>(
        process.env.TICKETS_COLLECTION_NAME
    ) 

    collections.tickets = ticketsCollection

    collections.tickets.createIndex(['userId', 'sectionKey'])
}

import 'dotenv/config'
import { logger } from './loaders/logger'
import app from './loaders/express'
import { connectToDatabase } from './loaders/database'

const { PORT } = process.env

async function startServer() {
    await connectToDatabase()

    app.listen(PORT, () => {
        logger.info(`server listening on port ${PORT}`)
    })
}

startServer()

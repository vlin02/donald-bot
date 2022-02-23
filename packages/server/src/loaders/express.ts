import express, { ErrorRequestHandler } from 'express'
import 'dotenv/config'
import { logger } from './logger'
import apiRouter from '../routes'

const app = express()

app.enable('trust proxy')

app.use(express.json())

app.use('/api', apiRouter)

const errorHandler: ErrorRequestHandler = (err, _, res) => {
    logger.error('unknown exception thrown: %s', err)

    res.status(500).json({
        errors: {
            message: err.message
        }
    })
}

app.use(errorHandler)

export default app

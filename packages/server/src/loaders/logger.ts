import 'dotenv/config'
import { createLogger, format, transports } from 'winston'

const { LOG_LEVEL } = process.env

export const logger = createLogger({
    levels: { trace: 4, debug: 3, info: 2, warn: 1, error: 0 },
    format: format.combine(
        format.splat(),
        format.timestamp(),
        format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`
        })
    ),
    transports: [new transports.Console({ level: LOG_LEVEL })]
})

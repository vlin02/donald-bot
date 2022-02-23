import { logger } from '../../loaders/logger'

export function resolveErrorMessage(error: any) {
    switch (error?.code) {
        case 'SECTION_NOT_FOUND':
            return `**${error.sectionKey}** couldn't be found in the course list`
        case 'TICKET_EXISTS':
            return `you have already added a ticket for **${error.sectionKey}**`
        case 'TICKET_LIMIT_REACHED':
            return `you have reached the ticket limit of ${error.limit}`
        default:
            logger.error('received an unknown server error %o', error)
            return 'unknown server error! Sorry, try again later'
    }
}

export interface ErrorMessageProps {
    error: any
}

export function buildErrorMessage({ error }: ErrorMessageProps) {
    const message = resolveErrorMessage(error)
    return `:x: ${message}`
}

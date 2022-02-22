import { ServiceError } from '../../../server/types/service'

export function resolveErrorMessage(error: ServiceError) {
    switch (error.code) {
        case 'SECTION_NOT_FOUND':
            return `**${error.sectionKey}** couldn't be found in the course list`
        case 'TICKET_EXISTS':
            return `you have already added a ticket for **${error.sectionKey}**`
        case 'TICKET_LIMIT_REACHED':
            return `you have reached the ticket limit of ${error.limit}`
    }
}

export interface ErrorMessageProps {
    error: ServiceError
}

export function buildErrorMessage({error}: ErrorMessageProps)  {
    const message = resolveErrorMessage(error)
    return `:x: ${message}`
}
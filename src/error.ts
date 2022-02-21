export type ServiceErrorPayload =
    | {
          code: 'TICKET_LIMIT_REACHED'
          limit: number
      }
    | {
          code: 'TICKET_EXISTS'
          sectionKey: string
      }
    | {
          code: 'SECTION_NOT_FOUND'
          sectionKey: string
      }

export class ServiceError extends Error {
    payload: ServiceErrorPayload

    constructor(payload) {
        super("A service related error occured")
        this.payload = payload
    }
}

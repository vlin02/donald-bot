export type ServiceResult<TSuccessPayload = null, TCodes = ErrorCodes> =
    | {
          response: 'success'
          payload: TSuccessPayload
      }
    | {
          response: 'error'
          payload: Extract<ServiceError, {code: TCodes}>
      }

export type ErrorCodes = ServiceError['code']

export type ServiceError =
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
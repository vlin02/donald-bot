export type ServiceResponse<TSuccessPayload = null, TErrorPayload = null> =
    | {
          result: 'success'
          payload: TSuccessPayload
      }
    | {
          result: 'error'
          payload: TErrorPayload
      }

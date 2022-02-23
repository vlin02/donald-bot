import { SectionStatus } from "@donald-bot/scraper"
import { ServiceResponse } from "../../types/service"

export interface AddTicketProps {
  discordId: string
  sectionKey: string
}

export type AddTicketResult = {
  status: SectionStatus
}

export type AddTicketError =
  | {
      code: "TICKET_LIMIT_REACHED"
      limit: number
    }
  | {
      code: "TICKET_EXISTS"
      sectionKey: string
    }
  | {
      code: "SECTION_NOT_FOUND"
      sectionKey: string
    }

export type AddTicketResponse = ServiceResponse<AddTicketResult, AddTicketError>

export interface TicketServiceInterface {
  addTicket: (props: AddTicketProps) => Promise<AddTicketResponse>
}

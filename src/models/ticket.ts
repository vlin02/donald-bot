export type QueueStatus = {
    size: number,
    filled: number
}

export type SectionStatus =
    | {
          enroll: QueueStatus,
          waitlist: QueueStatus,
          closed: false
      }
    | {
          closed: true
      }

export type Ticket = {
    userId: string
    sectionKey: string
    status: SectionStatus
}

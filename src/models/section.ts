export interface QueueStatus {
    filled: number
    size: number
}

export interface SectionStatus {
    enroll: QueueStatus
    waitlist: QueueStatus
    closed: boolean
}

export interface Section {
    key: string
    status: SectionStatus
}

export const SectionKeyRegex =
    /^(\d{2}[WSF1]) ([A-Z ]*) ([A-Z])?(\d*)([A-Z]*) \((\d*)\)$/
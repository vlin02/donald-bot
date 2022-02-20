export type SectionKey = string

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
    key: SectionKey
    status: SectionStatus
}
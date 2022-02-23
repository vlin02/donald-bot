export interface QueueStatus {
    filled: number
    size: number
}

export interface SectionStatus {
    enroll: QueueStatus
    waitlist: QueueStatus
    closed: boolean
}

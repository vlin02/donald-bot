import { SectionStatus } from "../models/ticket"

export const SectionAction = {
    ENROLL: {
        value: 'enrollment open'
    },
    WAITLIST: {
        value: 'waitlist open'
    },
    FULL: {
        value: 'full/closed'
    }
}

export function inferSectionAction(status: SectionStatus) {
    if (status.closed) return SectionAction.FULL

    if (status.enroll.filled < status.enroll.size) return SectionAction.ENROLL
    if (status.waitlist.filled < status.waitlist.filled) return SectionAction.WAITLIST

    return SectionAction.FULL
}
import { SectionStatus } from "../models/ticket"

export const SectionAvailability = {
    ENROLL: {
        color: '3da560',
        tag: 'open',
        emote: ':green_square:',
        priority: 0
    },
    WAITLIST: {
        color: 'f9a62b',
        tag: 'waitlist',
        emote: ':yellow_square:',
        priority: 1
    },
    FULL: {
        color: 'ec4145',
        tag: 'full',
        emote: ':red_square:',
        priority: 2
    },
    CLOSED: {
        tag: 'closed',
        color: 'ec4145',
        emote: ':red_square:',
        priority: 3
    }
}

export function inferSectionAvailability(status: SectionStatus) {
    if (status.enroll.size === 0) return SectionAvailability.CLOSED
    else if (status.enroll.filled < status.enroll.size)
        return SectionAvailability.ENROLL
    else if (status.waitlist.filled < status.waitlist.filled)
        return SectionAvailability.WAITLIST
    else return SectionAvailability.FULL
}
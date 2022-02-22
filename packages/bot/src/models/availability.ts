import type { SectionStatus } from "@donald-bot/scraper"

export const ENROLL = {
    color: '3da560',
    tag: 'open',
    emote: ':green_square:',
    priority: 0
}

export const WAITLIST = {
    color: 'f9a62b',
    tag: 'waitlist',
    emote: ':yellow_square:',
    priority: 1
}
export const FULL = {
    color: 'ec4145',
    tag: 'full',
    emote: ':red_square:',
    priority: 2
}
export const CLOSED = {
    tag: 'closed',
    color: 'ec4145',
    emote: ':red_square:',
    priority: 3
}

export function getFromStatus(status: SectionStatus) {
    if (status.enroll.size === 0) return CLOSED
    else if (status.enroll.filled < status.enroll.size) return ENROLL
    else if (status.waitlist.filled < status.waitlist.filled) return WAITLIST
    else return FULL
}
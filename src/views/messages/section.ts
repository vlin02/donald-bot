import { getFromStatus } from '../../models/availability'
import { SectionStatus } from '../../models/section'
import { multiline } from '../../utils/format'

export interface SectionProps {
    key: string
    status: SectionStatus
}

export function buildSectionStatusMessage({ key, status }: SectionProps) {
    const enrollStatus = status.enroll.size
        ? `${status.enroll.filled}/${status.enroll.size}`
        : 'N/A'

    const waitlistStatus = status.waitlist.size
        ? `${status.waitlist.filled}/${status.waitlist.size}`
        : 'N/A'

    const avail = getFromStatus(status)

    const statusTag = avail.tag.toUpperCase()
    const statusEmote = avail.emote

    return multiline(
        `${statusEmote} __**${key}**__`,
        `Status **${statusTag}**`,
        `Enrolled  **${enrollStatus}**`,
        `Waitlisted **${waitlistStatus}**`
    )
}

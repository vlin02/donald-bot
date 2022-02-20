import { SectionStatus } from '../../models/section'

export function parseSectionStatus(html: string): SectionStatus {
    let result: RegExpMatchArray | null

    const status: SectionStatus = {
        enroll: {
            size: 0,
            filled: 0
        },
        waitlist: {
            size: 0,
            filled: 0
        },
        closed: false
    }

    result = html.match(/Closed by Dept/)

    if (result) {
        return status
    }

    result = html.match(/Class Full \((\d*)\)/)
    if (result) {
        const seats = Number(result[1])
        status.enroll.size = seats
        status.enroll.filled += seats
    }

    result = html.match(/(\d*) of (\d*) enrolled/)
    if (result) {
        const filled = Number(result[1])
        const seats = Number(result[2])

        status.enroll.size = seats
        status.enroll.filled = filled
    }

    result = html.match(/Waitlist Full \((\d*)\)/)
    if (result) {
        const seats = Number(result[1])
        status.waitlist.size = seats
        status.waitlist.filled = seats
    }

    result = html.match(/(\d*) of (\d*) Taken/)
    if (result) {
        const filled = Number(result[1])
        const seats = Number(result[2])

        status.waitlist.size = seats
        status.waitlist.filled += filled
    }

    return status
}

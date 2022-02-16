import axios from 'axios'

export type CatalogNumber = {
    base: number
    extension?: string
}

export type Quarter = 'spring' | 'summer' | 'winter' | 'fall'

export interface SectionIdentifier {
    year: number
    quarter: Quarter
    subjectArea: string
    catalogNumber: CatalogNumber
    sectionNumber: number
}

export type QueueStatus = {
    size: number
    filled: number
}

export type SectionStatus = {
    enrollment: QueueStatus
    waitlist: QueueStatus | null
}

export enum SectionAction {
    ENROLL = 0,
    WAITLIST = 1,
    NONE = 2,
    UNKNOWN = 3
}

export const QuarterAbbrevvMap = {
    spring: 'S',
    fall: 'F',
    winter: 'W',
    summer: '1'
}

export const AbbrevQuarterMapping: Record<string, Quarter> = {
    S: 'spring',
    F: 'fall',
    W: 'winter',
    '1': 'summer'
}

export function identifierToParams(identifier: SectionIdentifier) {
    const { year, quarter, subjectArea, catalogNumber, sectionNumber } =
        identifier

    return {
        t: String(year) + QuarterAbbrevvMap[quarter],
        sBy: 'subject',
        subj_area_cd: subjectArea,
        crs_catlg_no:
            String(catalogNumber.base).padStart(4, '0') +
            (catalogNumber.extension ?? ''),
        class_no: String(sectionNumber).padStart(3, '0').padStart(4, ' ')
    }
}

export function sectionAsString(identifier: SectionIdentifier) {
    const { year, quarter, subjectArea, catalogNumber, sectionNumber } =
        identifier
    return `${year}${QuarterAbbrevvMap[quarter]} ${subjectArea} ${
        catalogNumber.base
    }${catalogNumber.extension ?? ''} (${sectionNumber})`
}

export function extractEnrolled(html: string): QueueStatus {
    let matchResult
    matchResult = html.match(/(\d*) of (\d*) Enrolled/)

    if (matchResult) {
        return {
            filled: Number(matchResult[1]),
            size: Number(matchResult[2])
        }
    }

    matchResult = html.match(/Class Full \((\d*)\)/)

    if (matchResult) {
        return {
            filled: Number(matchResult[1]),
            size: Number(matchResult[1])
        }
    }

    matchResult = html.match(/(\d*) of (\d*) /)

    throw new Error('could not find enrollment status')
}

export function extractWaitlist(html: string): QueueStatus | null {
    let matchResult

    matchResult = html.match(/(\d*) of (\d*) Taken/)
    if (matchResult) {
        return {
            filled: Number(matchResult[1]),
            size: Number(matchResult[2])
        }
    }

    matchResult = html.match(/No Waitlist/)
    if (matchResult) return null

    throw new Error('could not find waitlist status')
}

export function isClosed(html: string) {
    let matchResult

    matchResult = html.match(/Closed by Dept/)

    return matchResult !== null
}

export async function fetchSectionStatus(
    identifier: SectionIdentifier
): Promise<SectionStatus | null> {
    const params = identifierToParams(identifier)

    const { data: htmlContent } = await axios.get<string>(
        'https://sa.ucla.edu/ro/public/soc/Results',
        {
            params
        }
    )
    return isClosed(htmlContent)
        ? null
        : {
              enrollment: extractEnrolled(htmlContent),
              waitlist: extractWaitlist(htmlContent)
          }
}

export function currentSectionAction(status: SectionStatus): SectionAction {
    if (!status) return SectionAction.NONE

    const { enrollment, waitlist } = status
    if (enrollment.filled < enrollment.size) return SectionAction.ENROLL

    if (!waitlist) return SectionAction.NONE

    if (waitlist.filled < waitlist.size) return SectionAction.WAITLIST

    return SectionAction.NONE
}

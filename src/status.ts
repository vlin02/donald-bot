import axios from 'axios'

type CatalogNumber = {
    base: number
    extension?: string
}

type SectionConfig = {
    year: number
    quarter: 'spring' | 'summer' | 'winter' | 'fall'
    subjectArea: string
    catalogNumber: CatalogNumber
    sectionNumber: number
}

type Status = {
    seats: number
    occupied: number
}

type SectionStatus = {
    enrollment: Status
    waitlist: Status | null
} | null

export function configToParams(config: SectionConfig) {
    const abbrevMap = {
        spring: 'S',
        fall: 'F',
        winter: 'W',
        summer: '1'
    }

    const { year, quarter, subjectArea, catalogNumber, sectionNumber } = config

    return {
        t: String(year) + abbrevMap[quarter],
        sBy: 'subject',
        subj_area_cd: subjectArea,
        crs_catlg_no:
            String(catalogNumber.base).padStart(4, '0') +
            (catalogNumber.extension ?? ''),
        class_no: String(sectionNumber).padStart(3, '0').padStart(4, ' ')
    }
}

export function extractEnrolled(html: string): Status {
    let matchResult
    matchResult = html.match(/(\d*) of (\d*) Enrolled/)

    if (matchResult) {
        return {
            occupied: Number(matchResult[1]),
            seats: Number(matchResult[2])
        }
    }

    matchResult = html.match(/Class Full \((\d*)\)/)

    if (matchResult) {
        return {
            occupied: Number(matchResult[1]),
            seats: Number(matchResult[1])
        }
    }

    matchResult = html.match(/(\d*) of (\d*) /)

    throw new Error('could not find enrollment status')
}

export function extractWaitlist(html: string): Status | null {
    let matchResult

    matchResult = html.match(/(\d*) of (\d*) Taken/)
    if (matchResult) {
        return {
            occupied: Number(matchResult[1]),
            seats: Number(matchResult[2])
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
    config: SectionConfig
): Promise<SectionStatus> {
    const params = configToParams(config)

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

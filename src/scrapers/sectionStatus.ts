import axios from 'axios'
import { ParsingError } from '../error'
import { SectionStatus } from '../models/ticket'
import subjectAreas from '../data/subjectAreas.json'

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

type SectionDetailParams = {
    term: string
    subjectArea: string
    catalogNumber: string
    classNumber: string
}

const subjectAreaNames = subjectAreas.map((subjectArea) => subjectArea.value)

export function getSectionDetailParams(
    sectionKey: string
): SectionDetailParams {
    const result = sectionKey.match(
        /^(\d{2}[WSF1]) ([A-Z ]*) ([A-Z])?(\d*)([A-Z]*) \((\d*)\)$/
    )

    if (!result) throw new ParsingError('invalid section key')

    const [
        _match,
        term,
        subjectArea,
        catalogPre,
        catalogBase,
        catalogExt,
        classNumber
    ] = result

    if (!subjectAreaNames.includes(subjectArea))
        throw new ParsingError('invalid subject area provided')

    const catalogNumber =
        catalogBase.padStart(4, '0') +
        (catalogExt ?? '') +
        (catalogPre ? ' ' + catalogPre : '')
        
    const paddedClassNumber = ' ' + classNumber.padStart(3, '0')

    return {
        term,
        subjectArea,
        catalogNumber,
        classNumber: paddedClassNumber
    }
}

export function parseHTML(html: string): SectionStatus {
    let result

    const status: SectionStatus = {
        enroll: {
            size: 0,
            filled: 0
        },
        waitlist: {
            size: 0,
            filled: 0
        }
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

    result = html.match(/(\d*) of (\d*) Enrolled/)
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

class SectionStatusScraper {
    sectionKey: string

    constructor(sectionKey: string) {
        this.sectionKey = sectionKey
    }

    _getRequestParams() {
        const { term, subjectArea, catalogNumber, classNumber } =
            getSectionDetailParams(this.sectionKey)

        return {
            t: term,
            sBy: 'subject',
            subj_area_cd: subjectArea,
            crs_catlg_no: catalogNumber,
            class_no: classNumber
        }
    }

    async _retrieveHTML() {
        const { data: html } = await axios.get<string>(
            'https://sa.ucla.edu/ro/public/soc/Results',
            {
                params: this._getRequestParams()
            }
        )

        return html
    }

    async scrape(): Promise<SectionStatus> {
        const html = await this._retrieveHTML()
        const status = parseHTML(html)

        return status
    }
}

export async function scrape(sectionKey: string) {
    const scraper = new SectionStatusScraper(sectionKey)
    return scraper.scrape()
}

import axios from 'axios'
import { ParsingError } from '../error'
import { SectionStatus } from '../models/ticket'

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

type SectionDetailParams = {
    term: string
    subjectArea: string
    catalogNumber: string
    classNumber: string
}

export function getSectionDetailParams(
    sectionKey: string
): SectionDetailParams {
    const result = sectionKey.match(
        /^(\d{2}[WSF1]) ([A-Z ]*) (\d*)([A-Z]*) \((\d*)\)$/
    )

    if (!result) throw new ParsingError('invalid section key')

    const [_match, term, subjectArea, catalogBase, catalogExt, classNumber] =
        result

    const catalogNumber = catalogBase.padStart(4, '0') + catalogExt
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

    result = html.match(/Closed by Dept/)

    if (result) {
        return {
            closed: true
        }
    }

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
        return parseHTML(html)
    }
}

export async function scrape(sectionKey: string) {
    const scraper = new SectionStatusScraper(sectionKey)
    return scraper.scrape()
}
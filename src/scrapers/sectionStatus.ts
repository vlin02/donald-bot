import axios from 'axios'
import { SectionStatus } from '../models/ticket'

type SectionDetailParams = {
    term: string
    subjectArea: string
    catalogNumber: string
    classNumber: string
}

export const sectionKeyRegex = /^(\d{2}[WSF1]) ([A-Z ]*) ([A-Z])?(\d*)([A-Z]*) \((\d*)\)$/

export function getSectionDetailParams(
    sectionKey: string
): SectionDetailParams {
    const result = sectionKey.match(sectionKeyRegex)

    if (!result) throw new Error('invalid section key')

    const [
        _match,
        term,
        subjectArea,
        catalogPre,
        catalogBase,
        catalogExt,
        classNumber
    ] = result

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

export function parsePageHTML(html: string): SectionStatus {
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

export class PageRetriever {
    sectionKey: string

    constructor(sectionKey: string) {
        this.sectionKey = sectionKey
    }

    getRequestParams() {
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

    async retrieveHTML() {
        const { data: html } = await axios.get<string>(
            'https://sa.ucla.edu/ro/public/soc/Results',
            {
                params: this.getRequestParams()
            }
        )

        return html
    }
}

export async function retrieveHTML(sectionKey: string) {
    const retriever = new PageRetriever(sectionKey)
    return retriever.retrieveHTML()
}

export async function scrape(sectionKey: string) {
    const html = await retrieveHTML(sectionKey)
    return parsePageHTML(html)
}
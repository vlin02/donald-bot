import axios from 'axios'
import { getSearchParams } from '../../../v2/scrapers/SOC'
import { SectionKey } from '../../models/section'
import * as RegexMatch from '../../utils/regex-match'

type SearchParams = {
    term: string
    subjectArea: string
    catalogNumber: string
    classNumber: string
}

export class SectionPage {
    sectionKey: string

    constructor(sectionKey: SectionKey) {
        this.sectionKey = sectionKey
    }

    getSearchParams(): SearchParams {
        const result = this.sectionKey.match(RegexMatch.sectionKey)

        if (!result)
            throw new Error('sectionKey does not match regex')

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

    getRequestParams() {
        const { term, subjectArea, catalogNumber, classNumber } =
            getSearchParams(this.sectionKey)

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
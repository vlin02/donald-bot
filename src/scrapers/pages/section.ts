import axios from 'axios'
import { SectionKeyRegex } from '../../models/section'

type SearchParams = {
    term: string
    subjectArea: string
    catalogNumber: string
    classNumber: string
}

export class SectionPage {
    key: string

    constructor(key: string) {
        this.key = key
    }

    getSearchParams(): SearchParams {
        const result = this.key.match(SectionKeyRegex)

        if (!result) throw new Error('regex failed')

        const [_match, term, subjectArea, catalogPre, catalogBase, catalogExt, classNumber] = result

        const catalogNumber =
            catalogBase.padStart(4, '0') + (catalogExt ?? '') + (catalogPre ? ' ' + catalogPre : '')

        const paddedClassNumber = ' ' + classNumber.padStart(3, '0')

        return {
            term,
            subjectArea,
            catalogNumber,
            classNumber: paddedClassNumber
        }
    }

    getRequestParams() {
        const params = this.getSearchParams()

        const { term, subjectArea, catalogNumber, classNumber } = params

        return {
            t: term,
            sBy: 'subject',
            subj_area_cd: subjectArea,
            crs_catlg_no: catalogNumber,
            class_no: classNumber
        }
    }

    async retrieveHTML() {
        const params = this.getRequestParams()

        const { data: html } = await axios.get<string>(
            'https://sa.ucla.edu/ro/public/soc/Results',
            {
                params
            }
        )

        return html
    }
}

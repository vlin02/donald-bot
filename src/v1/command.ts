import { AbbrevQuarterMapping, SectionIdentifier } from "./status"

export const toIdentifier = (term: string, course: string, section: number): SectionIdentifier => {
    let matchResult
    matchResult = course.toUpperCase().match(/^([A-Z' ']*) (\d*)([A-Z]*)?$/)
    if(!matchResult) throw Error('Invalid course name')

    const [_, subjectArea, base, extension] = matchResult


    return {
        year: Number(term.slice(0,2)),
        quarter: AbbrevQuarterMapping[term.toUpperCase()[2]],
        subjectArea,
        catalogNumber: {
            base: Number(base),
            extension: extension
        },
        sectionNumber: Number(section)
    }
}


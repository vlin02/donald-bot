import { ValidationResult } from '../types'
import * as SubjectAreas from './SubjectAreas'

export const RegexMatch =
    /^(\d{2}[WSF1]) ([A-Z ]*) ([A-Z])?(\d*)([A-Z]*) \((\d*)\)$/

export function isValid(sectionKey: string): ValidationResult {
    const result = sectionKey.match(RegexMatch)

    if (!result) {
        return {
            message: `:x: Section **${sectionKey}** is improperly formatted`,
            value: false
        }
    }

    const subjectArea = result[2]
    if (!SubjectAreas.trimmedNames.includes(subjectArea)) {
        return {
            message: `:x: Subject area ${subjectArea} is not valid`,
            value: false
        }
    }

    return {
        value: true
    }
}

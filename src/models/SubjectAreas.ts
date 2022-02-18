import subjectAreas from '../data/subjectAreas.json'

export const trimmedNames = subjectAreas.map((subjectArea) => {
    const { value } = subjectArea
    return value.trim()
})

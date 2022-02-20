import subjectAreas from '../subject-areas.json'
import fs from 'fs'

const subjectAreasCleaned = subjectAreas.map((subj) => {
    return {
        label: subj.label.trim(),
        value: subj.value.trim()
    }
})

fs.writeFileSync(
    './data/processed/subject-areas.json',
    JSON.stringify(subjectAreasCleaned, null, '\t')
)

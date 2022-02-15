import { fetchSectionStatus } from "./status";

fetchSectionStatus({
    year: 22,
    quarter: 'spring',
    subjectArea: 'STATS',
    catalogNumber: {
        base: 20,
    },
    sectionNumber: 2
}).then(console.log)
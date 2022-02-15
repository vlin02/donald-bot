"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const status_1 = require("./status");
(0, status_1.fetchSectionStatus)({
    year: 22,
    quarter: 'spring',
    subjectArea: 'STATS',
    catalogNumber: {
        base: 20,
    },
    sectionNumber: 2
}).then(console.log);
//# sourceMappingURL=index.js.map
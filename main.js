import { getLearnerData } from './processor.js';
import { courseInfo, assignmentGroup, learnerSubmissions } from './data.js';

// Test valid data
// Output example:
// ┌─────────┬────────┬────────┬─────┬─────────┐
// │ (index) │ 1      │ 2      │ id  │ avg     │
// ├─────────┼────────┼────────┼─────┼─────────┤
// │ 0       │ '0.94' │ '1.00' │ 125 │ '0.985' │
// │ 1       │ '0.78' │ '0.84' │ 132 │ '0.825' │
// └─────────┴────────┴────────┴─────┴─────────┘
const result = getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);
console.table(result);

// Test error input
// Output example:
// throw new Error("Assignment group does not belong to its course");
courseInfo.id = 1;
const error = getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);
console.table(error);

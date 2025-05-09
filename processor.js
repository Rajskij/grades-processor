export function getLearnerData(course, ag, submissions) {
    // Validate course id
    if (ag.course_id !== course.id) {
        throw new Error("Assignment group does not belong to its course");
    }
    
    // Build data structures
    const submissionsByStudentId = buildStudentSubmissionsData(submissions);
    const assignmentDataById = buildAssignmentDataMap(ag.assignments);
    const results = [];

    // Process each student
    Object.entries(submissionsByStudentId).forEach(([studentId, studentAssignments]) => {
        const learner = processLearnerData(studentId, studentAssignments, assignmentDataById);
        results.push(learner);
    });

    return results;
}

/**
 * Creates a mapping of assignment IDs to their relevant data
 * @param {Array<Object>} assignments - Array of assignment objects
 * @returns {Map<number, {score: number, due_at: string}>} 
 *          Map where key is assignment ID and value contains score and due date
 */
const buildAssignmentDataMap = function(assignments) {
    const assignmentDataById = new Map();

    for (let assignment of assignments) {
        const id = assignment.id;
        const ass = {
            score: assignment.points_possible,
            due_at: assignment.due_at
        };
        assignmentDataById.set(id, ass);
    }

    return assignmentDataById;
}

/**
 * Groups submissions by learner_id into { learner_id: submissionDetails[] }.
 * @param {Array<Object>} submissions - Array of submission objects
 * @returns {Object} Mapped submissions by learner ID (e.g., { 125: [{ assignment_id: 1, score: 90, ... }]}).
 */
const buildStudentSubmissionsData = (submissions) => {
    return submissions.reduce((acc, { learner_id, assignment_id, submission }) => {
        if (!acc[learner_id]) {
            acc[learner_id] = [];
        }
        acc[learner_id].push({
            assignment_id: assignment_id,
            score: submission.score,
            submitted_at: submission.submitted_at
        })
        return acc;
    }, {});
}

/**
 * Processes a student's assignments to calculate scores and averages
 * @param {Number} studentId - The student's identifier
 * @param {Array<Object>} studentAssignments - Array of the student's assignments
 * @param {Map} assignmentDataById - Mapping of assignment IDs to their data
 * @returns {Object} Learner data object containing:
 *                   - id: Student ID
 *                   - [assignment_id]: Average score on the assignment
 *                   - avg: Average score on the assignments
 */
const processLearnerData = (studentId, studentAssignments, assignmentDataById) => {
    const learner = { id: studentId };
    let totalMaxScore = 0;
    let totalScore = 0;

    for (const { assignment_id, score, submitted_at } of studentAssignments) {
        let studentScore = score;
        const { score: assignmentScore, due_at } = assignmentDataById.get(assignment_id);

        validateScore(assignmentScore, studentScore);
        const { submitDate, dueDate, currentDate } = buildDate(submitted_at, due_at);

        if (submitDate > dueDate) {
            studentScore *= 0.9;
        }

        if (dueDate > currentDate) {
            continue;
        }
        totalScore += studentScore;
        totalMaxScore += assignmentScore;

        learner[assignment_id] = (studentScore / assignmentScore).toFixed(2);
    }

    learner.avg = (totalScore / totalMaxScore).toFixed(3);
    return learner;
}

/**
 * Creates Date objects from submission and assignment due dates
 * @param {String} studentDate - Student submission date
 * @param {String} assignmentDate - Assignment due date
 * @returns {{submitDate: Date, dueDate: Date, currentDate: Date}} Date objects or undefined if parsing fails
 * @throws {Error} If date parsing fails
 */

const buildDate = (studentDate, assignmentDate) => {
    try {
        return {
            submitDate: new Date(studentDate),
            dueDate: new Date(assignmentDate),
            currentDate: new Date()
        };
    } catch (error) {
        console.error("Date parsing failed:", error.message);
    }
}

/**
 * Validates assignment and student scores
 * @param {Number} assignmentScore - Assignment max score
 * @param {Number} studentScore - Student submission score
 * @throws {Error} When input validation fails with specific error messages
 */
const validateScore = (assignmentScore, studentScore) => {
    const arr = [assignmentScore, studentScore];

    for (let i = 0; i < arr.length; i++) {
        let scoreName = i === 0 ? "Assignment" : "Student";
        let score = arr[i];
        
        if (typeof score === 'undefined') {
            throw new Error(`${scoreName} score is missing`);
        }
        if (typeof score !== 'number' || isNaN(score)) {
            throw new Error(`${scoreName} score must be a valid number`);
        }
        if (scoreName === "Assignment" && score <= 0) {
            throw new Error("Assignment maximum score must be greater than 0");
        }
        if (scoreName === "Student" && score < 0) {
            throw new Error("Student score cannot be negative");
        }
        if (scoreName === "Student" && score > arr[0]) {
            throw new Error("Student score cannot exceed assignment maximum score");
        }
    }
};

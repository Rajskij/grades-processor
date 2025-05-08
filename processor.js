export function getLearnerData(course, ag, submissions) {
    // Validate course id
    if (ag.course_id !== course.id) {
        throw new Error("Assignment group does not belong to its course");
    }
    
    // Build data structures
    const submissionsByStudentId = buildStudentIdToScoreMap(submissions);
    const assignmentDataById = buildIdToAssignmentMap(ag.assignments);
    const results = [];

    // Process each student
    submissionsByStudentId.forEach((studentAssignments, studentId) => {
        const learner = processLearnerData(studentAssignments, assignmentDataById, studentId);
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
const buildIdToAssignmentMap = function(assignments) {
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
 * Organizes submissions by student ID
 * @param {Array<Object>} submissions - Array of submission objects
 * @returns {Map<number, Array<{assignment_id: number, score: number, submitted_at: string}>>}
 *          Map where key is student ID and value is array of their submissions
 */
const buildStudentIdToScoreMap = function(submissions) {
    const submissionsByStudentId = new Map();

    for (let sub of submissions) {
        const studentId = sub.learner_id;
        const assignmentData = {
            assignment_id: sub.assignment_id,
            score: sub.submission.score,
            submitted_at: sub.submission.submitted_at
        };
        addValue(submissionsByStudentId, studentId, assignmentData);
    }

    return submissionsByStudentId;
}

/**
 * Helper function to add values to a Map while handling key initialization
 */
const addValue = (map, key, value) => {
    if (!map.has(key)) {
        map.set(key, []);
    }
    map.get(key).push(value);
}

/**
 * Creates Date objects from submission and assignment due dates
 * @param {Object} studentData - Student submission data
 * @param {Object} assignment - Assignment information
 * @returns {{submitDate: Date, dueDate: Date}} Date objects or undefined if error occurs
 * @throws {Error} If date parsing fails (currently caught and logged)
 */

const buildDate = (studentData, assignment) => {
    try {
        const submitDate = new Date(studentData.submitted_at);
        const dueDate = new Date(assignment.due_at);
    
        return {submitDate, dueDate};
    } catch (error) {
        console.error("The error occurred:", error.message);
    }
}

/**
 * Processes a student's assignments to calculate scores and averages
 * @param {Array<Object>} studentAssignments - Array of the student's assignments
 * @param {Map} assignmentDataById - Mapping of assignment IDs to their data
 * @param {number} studentId - The student's identifier
 * @returns {Object} Learner data object containing:
 *                   - id: Student ID
 *                   - [assignment_id]: Average score on the assignment
 *                   - avg: Average score on the assignments
 */
const processLearnerData = (studentAssignments, assignmentDataById, studentId) => {
    const learner = { id: studentId };
    let totalMaxScore = 0;
    let totalScore = 0;

    for (let studentData of studentAssignments) {   
        const assignmentId = studentData.assignment_id;
        const assignmentData = assignmentDataById.get(assignmentId);

        let { assignmentScore, studentScore } = validateScore(assignmentData, studentData);
        const { submitDate, dueDate } = buildDate(studentData, assignmentData);
        const currentDate = new Date();

        if (submitDate > dueDate) {
            studentScore *= 0.9;
        }

        if (dueDate > currentDate) {
            continue;
        }
        totalScore += studentScore;
        totalMaxScore += assignmentScore;

        learner[assignmentId] = (studentScore / assignmentScore).toFixed(2); 
    }

    learner.avg = (totalScore / totalMaxScore).toFixed(3);
    return learner;
}

/**
 * Validates assignment and student scores
 * @param {Object} assignmentData - Assignment data containing score
 * @param {Object} studentData - Student submission data containing score
 * @returns {{assignmentScore: Number, studentScore: Number}} Validated scores
 * @throws {Error} When input validation fails with specific error messages
 */
const validateScore = (assignmentData, studentData) => {
    if (assignmentData == null) {
        throw new Error("Assignment data is missing or null");
    }
    if (studentData == null) {
        throw new Error("Student submission data is missing or null");
    }

    const assignmentScore = assignmentData.score;
    const studentScore = studentData.score;
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

    return { assignmentScore, studentScore };
};

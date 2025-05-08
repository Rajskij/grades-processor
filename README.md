# Grade Processing System

## Overview

This system processes student assignment submissions to calculate individual assignment scores and overall averages, applying late submission penalties and validating data integrity.

## Files

### `data.js`
Contains dummy data for testing:
- `courseInfo`: Course metadata
- `assignmentGroup`: Group of assignments with due dates and points
- `learnerSubmissions`: Student submission data

### `main.js`
Main entry point that imports and runs the processor with sample data.

### `processor.js`
Core processing logic with these main functions:

#### `getLearnerData(course, assignmentGroup, submissions)`
Main function for grade calculation process.

**Parameters:**
- `course`: Course information object
- `assignmentGroup`: Assignment group data
- `submissions`: Array of student submissions

**Returns:**
Array of learner result objects containing:
- Student ID
- Normalized scores for each assignment
- Overall average

**Throws:**
- If assignment group doesn't belong to course

### `buildIdToAssignmentMap(assignments)`
Creates a lookup map of assignment data.

### `buildStudentIdToScoreMap(submissions)`
Organizes submissions by student ID.

### `processLearnerData(studentAssignments, assignmentDataById, studentId)`
Calculates individual and average scores for one student.

### `validateScore(assignmentData, studentData)`
Validates score integrity with comprehensive checks.

## Business Rules

1. **Late Submissions**: 10% penalty for submissions after due date
2. **Validation**:
   - Scores must be valid numbers
   - Student scores can't exceed assignment maximum
   - Negative scores are invalid
3. **Averages**: Calculated only for assignments that are past due

## Error Handling

The system throws descriptive errors for:
- Invalid course/assignment group relationships
- Missing or null data
- Invalid score values/types
- Date parsing failures

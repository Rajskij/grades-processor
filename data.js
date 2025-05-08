const courseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const assignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,   // the ID of the course the assignment group belongs to
  group_weight: 25, // the percentage weight of the entire assignment group
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25", // the due date for the assignment
      points_possible: 50   // the maximum points possible for the assignment
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27", // the due date for the assignment
      points_possible: 150  // the maximum points possible for the assignment
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15", // the due date for the assignment
      points_possible: 500  // the maximum points possible for the assignment
    }
  ]
};

// The provided learner submission data.
const learnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

export {courseInfo, assignmentGroup, learnerSubmissions};

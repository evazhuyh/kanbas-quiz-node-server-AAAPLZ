import Database from "../Database/index.js";

export const findAllAssignments = () => {
  return Database.assignments;
};

export const findAssignmentsForCourse = (courseId) => {
  return Database.assignments.filter((assignment) => assignment.course === courseId);
};

export const createAssignment = (assignment) => {
  const newAssignment = { ...assignment, _id: new Date().getTime().toString() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
};

export const updateAssignment = (aid, assignment) => {
  const index = Database.assignments.findIndex((a) => a._id === aid);
  if (index === -1) return null;
  Database.assignments[index] = { ...Database.assignments[index], ...assignment };
  return Database.assignments[index];
};

export const deleteAssignment = (aid) => {
  Database.assignments = Database.assignments.filter((a) => a._id !== aid);
};
import model from "./model.js";

export const createAssignment = (assignment) => {
  return model.create(assignment);
};

export const findAssignmentsForCourse = (courseId) => {
  return model.find({ course: courseId });
};

export const findAssignmentById = (assignmentId) => {
  return model.findById(assignmentId);
};

export const updateAssignment = (assignmentId, assignment) => {
  return model.findByIdAndUpdate(assignmentId, { $set: assignment }, { new: true });
};

export const deleteAssignment = (assignmentId) => {
  return model.findByIdAndDelete(assignmentId);
};
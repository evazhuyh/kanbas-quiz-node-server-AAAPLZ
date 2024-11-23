import Database from "../Database/index.js";

export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  enrollments.push({ _id: new Date().getTime().toString(), user: userId, course: courseId });
}

export function unenrollUserFromCourse(userId, courseId) {
  Database.enrollments = Database.enrollments.filter(
    (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
  );
}

export function findAllEnrollments() {
  return Database.enrollments;
}

export function findEnrollmentsByUser(userId) {
  return Database.enrollments.filter(
    (enrollment) => enrollment.user === userId
  );
}

export function findEnrollmentsByCourse(courseId) {
  return Database.enrollments.filter(
    (enrollment) => enrollment.course === courseId
  );
}

export function findEnrollment(userId, courseId) {
  return Database.enrollments.find(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
}
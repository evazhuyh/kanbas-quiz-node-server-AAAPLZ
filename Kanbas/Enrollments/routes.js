import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  const findAllEnrollments = (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  };

  const findEnrollmentsByUser = (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsByUser(userId);
    res.json(enrollments);
  };

  const findEnrollmentsByCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsByCourse(courseId);
    res.json(enrollments);
  };

  const enrollInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "STUDENT") {
      res.sendStatus(403);
      return;
    }
    const { courseId } = req.params;
    
    // Check if already enrolled
    const enrollment = dao.findEnrollment(currentUser._id, courseId);
    if (enrollment) {
      res.sendStatus(400);
      return;
    }

    dao.enrollUserInCourse(currentUser._id, courseId);
    res.json({ status: "Success" });
  };

  const unenrollFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "STUDENT") {
      res.sendStatus(403);
      return;
    }
    const { courseId } = req.params;
    
    dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.json({ status: "Success" });
  };

  app.post("/api/courses/:courseId/enroll", enrollInCourse);
  app.delete("/api/courses/:courseId/enroll", unenrollFromCourse);
  app.get("/api/users/:userId/enrollments", findEnrollmentsByUser);
  app.get("/api/courses/:courseId/enrollments", findEnrollmentsByCourse);
  app.get("/api/enrollments", findAllEnrollments);
}
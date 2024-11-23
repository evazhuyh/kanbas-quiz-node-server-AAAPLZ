import * as dao from "./dao.js";
export default function CourseRoutes(app) {
  app.put("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = dao.updateCourse(courseId, courseUpdates);
    res.sendStatus(status);
  });
  app.delete("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(204);
  });
  app.post("/api/courses", (req, res) => {
    const courses = {...req.body, _id: new Date().getTime().toString() };
    dao.courses.push(course);
    res.send(courses);
  });
  app.get("/api/courses", (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  });
}

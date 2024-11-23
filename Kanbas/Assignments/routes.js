import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const assignments = dao.findAssignmentsForCourse(cid);
    res.json(assignments);
  });

  app.post("/api/courses/:cid/assignments", (req, res) => {
    const { cid } = req.params;
    const newAssignment = dao.createAssignment({ ...req.body, course: cid });
    res.json(newAssignment);
  });

  app.put("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    const status = dao.updateAssignment(aid, req.body);
    res.json(status);
  });

  app.delete("/api/assignments/:aid", (req, res) => {
    const { aid } = req.params;
    dao.deleteAssignment(aid);
    res.sendStatus(204);
  });
}
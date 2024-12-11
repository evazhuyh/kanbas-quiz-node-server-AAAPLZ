import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Create assignment
  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = await dao.createAssignment(assignment);
    res.json(newAssignment);
  });

  // Get all assignments for a course
  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  });

  // Get assignment by ID
  app.get("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    
    // 处理新建作业的情况
    if (assignmentId === "NewAssignment") {
      return res.json({
        title: "",
        description: "",
        points: 100,
        dueDate: new Date().toISOString(),
        availableFromDate: new Date().toISOString(),
        availableUntilDate: new Date().toISOString()
      });
    }
    
    const assignment = await dao.findAssignmentById(assignmentId);
    res.json(assignment);
  });

  // Update assignment
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.updateAssignment(assignmentId, req.body);
    res.json(status);
  });

  // Delete assignment
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.json(status);
  });
}
import * as quizzesDao from "./dao.js";

export default function QuizRoutes(app) {
  const checkFaculty = (req, res, next) => {
    if (req.session.role !== "FACULTY") {
      return res.status(403).send("Faculty access required");
    }
    next();
  };

  app.post("/api/courses/:courseId/quizzes", checkFaculty, async (req, res) => {
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await quizzesDao.createQuiz(quiz);
    res.json(newQuiz);
  });

  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await quizzesDao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  });

  app.get("/api/quizzes/:quizId", async (req, res) => {
    const { quizId } = req.params;
    const quiz = await quizzesDao.findQuizById(quizId);
    res.json(quiz);
  });

  app.put("/api/quizzes/:quizId", checkFaculty, async (req, res) => {
    const { quizId } = req.params;
    const status = await quizzesDao.updateQuiz(quizId, req.body);
    res.json(status);
  });

  app.delete("/api/quizzes/:quizId", checkFaculty, async (req, res) => {
    const { quizId } = req.params;
    const status = await quizzesDao.deleteQuiz(quizId);
    res.json(status);
  });

  app.post("/api/quizzes/:quizId/submit", async (req, res) => {
    const { quizId } = req.params;
    const studentId = req.session.userId;
    const attempt = req.body;
    
    const result = await quizzesDao.submitQuizAttempt(quizId, studentId, attempt);
    res.json(result);
  });

  app.get("/api/quizzes/:quizId/attempts", async (req, res) => {
    const { quizId } = req.params;
    const studentId = req.session.userId;
    const attempts = await quizzesDao.getStudentAttempts(quizId, studentId);
    res.json(attempts);
  });
}
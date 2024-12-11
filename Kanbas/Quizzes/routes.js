import * as quizzesDao from "./dao.js";

function QuizRoutes(app) {
  const checkFaculty = (req, res, next) => {
    if (req.session.role !== "FACULTY") {
      return res.status(403).json({ 
        error: "Faculty access required" 
      });
    }
    next();
  };

  const handleErrors = (fn) => async (req, res) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        error: error.message || "Internal server error" 
      });
    }
  };

  // 创建新测验
  app.post("/api/courses/:courseId/quizzes", checkFaculty, handleErrors(async (req, res) => {
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await quizzesDao.createQuiz(quiz);
    res.json(newQuiz);
  }));

  // 获取课程的所有测验
  app.get("/api/courses/:courseId/quizzes", handleErrors(async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await quizzesDao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  }));

  // 获取单个测验详情
  app.get("/api/quizzes/:quizId", handleErrors(async (req, res) => {
    const { quizId } = req.params;
    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  }));

  // 更新测验
  app.put("/api/quizzes/:quizId", checkFaculty, handleErrors(async (req, res) => {
    const { quizId } = req.params;
    const updatedQuiz = await quizzesDao.updateQuiz(quizId, req.body);
    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(updatedQuiz);
  }));

  // 删除测验
  app.delete("/api/quizzes/:quizId", checkFaculty, handleErrors(async (req, res) => {
    const { quizId } = req.params;
    const result = await quizzesDao.deleteQuiz(quizId);
    if (!result) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(result);
  }));

  // 切换发布状态
  app.patch("/api/quizzes/:quizId/toggle-publish", checkFaculty, handleErrors(async (req, res) => {
    const { quizId } = req.params;
    const updatedQuiz = await quizzesDao.togglePublishStatus(quizId);
    res.json(updatedQuiz);
  }));

  // 提交测验尝试
  app.post("/api/quizzes/:quizId/attempts", handleErrors(async (req, res) => {
    const { quizId } = req.params;
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz.published) {
      return res.status(403).json({ error: "Quiz is not published" });
    }

    const result = await quizzesDao.submitQuizAttempt(quizId, userId, req.body);
    res.json(result);
  }));

  // 获取学生的测验尝试记录
  app.get("/api/quizzes/:quizId/attempts", handleErrors(async (req, res) => {
    const { quizId } = req.params;
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const attempts = await quizzesDao.getStudentAttempts(quizId, userId);
    res.json(attempts);
  }));
}

export default QuizRoutes;
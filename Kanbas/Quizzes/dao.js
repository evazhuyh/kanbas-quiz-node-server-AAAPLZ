import model from "./model.js";

export async function createQuiz(quiz) {
  delete quiz._id;
  const newQuiz = await model.create(quiz);
  return newQuiz;
}

export async function findQuizzesForCourse(courseId) {
  return model.find({ course: courseId });
}

export async function findQuizById(quizId) {
  return model.findById(quizId);
}

export async function updateQuiz(quizId, updates) {
  return model.findByIdAndUpdate(quizId, updates, { new: true });
}

export async function deleteQuiz(quizId) {
  return model.findByIdAndDelete(quizId);
}

export async function submitQuizAttempt(quizId, studentId, attempt) {
  const quiz = await findQuizById(quizId);
  
  // Calculate score
  let totalCorrect = 0;
  const scoredAnswers = attempt.answers.map(answer => {
    const question = quiz.questions.id(answer.questionId);
    const isCorrect = question.correctAnswer === answer.answer;
    if (isCorrect) totalCorrect += question.points;
    return { ...answer, isCorrect };
  });

  const newAttempt = {
    student: studentId,
    answers: scoredAnswers,
    score: totalCorrect,
    startTime: attempt.startTime,
    endTime: new Date()
  };

  return model.findByIdAndUpdate(
    quizId,
    { $push: { attempts: newAttempt } },
    { new: true }
  );
}

export async function getStudentAttempts(quizId, studentId) {
  const quiz = await model.findOne(
    { 
      _id: quizId,
      "attempts.student": studentId 
    },
    { "attempts.$": 1 }
  );
  return quiz?.attempts || [];
}
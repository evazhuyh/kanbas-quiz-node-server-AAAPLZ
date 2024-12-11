import model from "./model.js";

export async function createQuiz(quiz) {
  delete quiz._id;
  const newQuiz = await model.create(quiz);
  return newQuiz;
}

export async function findQuizzesForCourse(courseId) {
  return model.find({ course: courseId }).sort({ createdAt: -1 });
}

export async function findQuizById(quizId) {
  // 添加ID验证
  if (!quizId) {
    throw new Error("Quiz ID is required");
  }
  return model.findById(quizId);
}

export async function updateQuiz(quizId, updates) {
  // 确保不能更新敏感字段
  const safeUpdates = { ...updates };
  delete safeUpdates.attempts; // 防止直接修改答题记录
  return model.findByIdAndUpdate(quizId, safeUpdates, { new: true });
}

export async function deleteQuiz(quizId) {
  return model.findByIdAndDelete(quizId);
}

export async function submitQuizAttempt(quizId, userId, attempt) {
  const quiz = await findQuizById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // 验证尝试次数
  const existingAttempts = quiz.attempts.filter(a => a.userId === userId);
  if (quiz.multipleAttempts === false && existingAttempts.length > 0) {
    throw new Error("Multiple attempts not allowed");
  }
  if (existingAttempts.length >= quiz.maxAttempts) {
    throw new Error("Maximum attempts reached");
  }

  // 计算分数
  let totalScore = 0;
  const answers = new Map();

  for (const [questionId, answer] of Object.entries(attempt.answers)) {
    const question = quiz.questions.find(q => q._id.toString() === questionId);
    if (!question) continue;

    let isCorrect = false;
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        isCorrect = question.choices.find(c => c.isCorrect)?.text === answer;
        break;
      case 'TRUE_FALSE':
        isCorrect = question.correctAnswer === answer;
        break;
      case 'FILL_IN_BLANK':
        isCorrect = question.possibleAnswers.includes(answer);
        break;
    }

    if (isCorrect) {
      totalScore += question.points;
    }
    answers.set(questionId, answer);
  }

  const finalScore = (totalScore / quiz.points) * 100; // 转换为百分比

  const newAttempt = {
    userId,
    quizId,
    answers,
    score: finalScore,
    startedAt: attempt.startedAt || new Date().toISOString(),
    submittedAt: new Date().toISOString()
  };

  return model.findByIdAndUpdate(
    quizId,
    { $push: { attempts: newAttempt } },
    { new: true }
  );
}

export async function getStudentAttempts(quizId, userId) {
  const quiz = await model.findById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  
  return quiz.attempts.filter(attempt => attempt.userId === userId)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
}

export async function togglePublishStatus(quizId) {
  const quiz = await findQuizById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  
  quiz.published = !quiz.published;
  return quiz.save();
}

//quiz questions
export async function addQuestionToQuiz(quizId, question) {
  return model.findByIdAndUpdate(
    quizId,
    { $push: { questions: question } },
    { new: true }
  );
}

export async function updateQuizQuestion(quizId, questionId, updates) {
  return model.findOneAndUpdate(
    { 
      _id: quizId,
      "questions._id": questionId 
    },
    { 
      $set: {
        "questions.$": { ...updates, _id: questionId }
      }
    },
    { new: true }
  );
}

export async function deleteQuizQuestion(quizId, questionId) {
  return model.findByIdAndUpdate(
    quizId,
    { 
      $pull: { 
        questions: { _id: questionId }
      }
    },
    { new: true }
  );
}

export async function reorderQuizQuestions(quizId, questionIds) {
  const quiz = await findQuizById(quizId);
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // 创建新的问题数组，按照提供的顺序重排
  const reorderedQuestions = questionIds.map(id => 
    quiz.questions.find(q => q._id.toString() === id)
  ).filter(Boolean);

  quiz.questions = reorderedQuestions;
  return quiz.save();
}
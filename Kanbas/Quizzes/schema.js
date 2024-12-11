import mongoose from "mongoose";

// 问题的 schema 定义
const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK'],  // 更新为与前端一致的枚举值
    required: true 
  },
  points: { type: Number, default: 1 },
  question: { type: String, required: true },
  // 根据问题类型区分存储结构
  choices: [{                        // 针对多选题
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: Boolean,           // 针对判断题
  possibleAnswers: [String]        // 针对填空题
});

// 答题尝试的 schema 定义
const attemptSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // 更改为与前端一致
  quizId: { type: String, required: true },  // 更改为与前端一致
  answers: { type: Map, of: mongoose.Schema.Types.Mixed }, // 使用 Map 存储答案
  score: { type: Number, required: true },
  startedAt: { type: Date, required: true }, // 更改为与前端一致
  submittedAt: Date                          // 更改为与前端一致
});

// 主 Quiz schema
const schema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      default: "New Quiz" 
    },
    description: { 
      type: String,
      default: "Please complete this quiz by the due date."
    },
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "CourseModel",
      required: true 
    },
    points: { 
      type: Number, 
      required: true,
      default: 100 
    },
    quizType: { 
      type: String, 
      enum: ['GRADED_QUIZ', 'PRACTICE_QUIZ', 'GRADED_SURVEY', 'UNGRADED_SURVEY'],
      default: 'GRADED_QUIZ',
      required: true
    },
    assignmentGroup: { 
      type: String,
      enum: ['QUIZZES', 'EXAMS', 'ASSIGNMENTS', 'PROJECT'],
      default: 'QUIZZES',
      required: true
    },
    published: { 
      type: Boolean, 
      default: false,
      required: true 
    },
    timeLimit: { 
      type: Number, 
      default: 20,
      required: true 
    },
    multipleAttempts: { 
      type: Boolean, 
      default: false,
      required: true 
    },
    maxAttempts: { 
      type: Number, 
      default: 1,
      required: true 
    },
    showCorrectAnswers: { 
      type: Boolean, 
      default: false,
      required: true 
    },
    accessCode: { 
      type: String, 
      default: null,
      required: false 
    },
    oneQuestionAtATime: { 
      type: Boolean, 
      default: true,
      required: true 
    },
    webcamRequired: { 
      type: Boolean, 
      default: false,
      required: true 
    },
    lockQuestionsAfterAnswering: { 
      type: Boolean, 
      default: false,
      required: true 
    },
    dueDate: { 
      type: Date,
      required: true,
      default: Date.now 
    },
    availableFrom: { 
      type: Date,
      required: true,
      default: Date.now 
    },
    availableUntil: { 
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    shuffleAnswers: { 
      type: Boolean, 
      default: true,
      required: true 
    },
    questions: [questionSchema],
    attempts: [attemptSchema]
  },
  { 
    collection: "quizzes",
    timestamps: true // 添加 createdAt 和 updatedAt
  }
);

export default schema;
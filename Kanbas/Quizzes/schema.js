import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK'] },
  points: { type: Number, default: 1 },
  question: String,
  choices: [String],  // For multiple choice
  correctAnswer: mongoose.Schema.Types.Mixed, // String for fill-blank, Number for multiple-choice, Boolean for true/false
  possibleAnswers: [String] // For fill-blank questions
});

const attemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean
  }],
  score: Number,
  startTime: Date,
  endTime: Date
});

const schema = new mongoose.Schema(
  {
    title: { type: String, default: "Unnamed Quiz" },
    description: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
    published: { type: Boolean, default: false },
    points: { type: Number, default: 0 },
    quizType: { 
      type: String, 
      enum: ['GRADED_QUIZ', 'PRACTICE_QUIZ', 'GRADED_SURVEY', 'UNGRADED_SURVEY'],
      default: 'GRADED_QUIZ'
    },
    assignmentGroup: { 
      type: String,
      enum: ['QUIZZES', 'EXAMS', 'ASSIGNMENTS', 'PROJECT'],
      default: 'QUIZZES'
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 }, // in minutes
    multipleAttempts: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1 },
    showCorrectAnswers: Boolean,
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: Date,
    availableFrom: Date,
    availableUntil: Date,
    questions: [questionSchema],
    attempts: [attemptSchema]
  },
  { collection: "quizzes" }
);

export default schema;

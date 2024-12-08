import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true,  // 去除首尾空格
      minlength: 1 // 确保不是空字符串
    },
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "CourseModel",
      required: true 
    },
    description: String,
    points: { 
      type: Number, 
      default: 100,
      min: 0 
    },
    dueDate: { 
      type: Date,
      default: Date.now 
    },
    availableFromDate: { 
      type: Date,
      default: Date.now 
    },
    availableUntilDate: { 
      type: Date,
      default: () => new Date(+new Date() + 7*24*60*60*1000) // 默认截止日期为一周后
    }
  },
  { collection: "assignments" }
);

export default assignmentSchema;
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import UserRoutes from "./Kanbas/Users/routes.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from "./Kanbas/Assignments/routes.js";
import EnrollmentRoutes from "./Kanbas/Enrollments/routes.js";
const port = process.env.PORT || 4000;
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb+srv://yihuazhu:kanbasmongo@kanbas.jxbei.mongodb.net/kanbas"
mongoose.connect(CONNECTION_STRING);

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:3000",
  })
 );
  const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app);
ModuleRoutes(app);
CourseRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);

// 在 MongoDB 连接部分添加详细日志
mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB Connection String:", CONNECTION_STRING);
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

// 添加请求日志中间件 (在 cors 和 session 配置之后)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log("Request Headers:", req.headers);
  console.log("Session:", req.session);
  next();
});

// 在路由处理中添加错误处理
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  console.error("Stack trace:", err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

Hello(app);
Lab5(app);
app.listen(port);
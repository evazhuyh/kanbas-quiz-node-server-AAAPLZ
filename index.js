import express from "express";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kanbas/Users/routes.js";

const app = express();
UserRoutes(app);
app.use(cors());
app.use(express.json());
Lab5(app);
app.listen(4000);
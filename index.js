import express from "express";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
Lab5(app);
app.listen(4000);
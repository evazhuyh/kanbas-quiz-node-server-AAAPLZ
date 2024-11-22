import express from "express";
import HelloRoutes from "./Hello.js";
import Lab5 from "./Lab5/index.js";
const app = express();

HelloRoutes(app);
Lab5(app);

app.listen(process.env.PORT || 4000);
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import routes
import userRouter from "./routes/user.route.js";
import applicationRouter from "./routes/application.route.js";
import jobRouter from "./routes/job.route.js";

//routes declartion
app.use("/api/v1/users", userRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/jobs", jobRouter);

export default app;

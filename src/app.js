import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import userRouter from "./routes/user.route.js"
import applicationRouter from "./routes/application.route.js"
import jobRouter from "./routes/job.route.js"


//routes declartion
app.use("/api/v1/users", userRouter)
app.use("/api/v1/applications", applicationRouter)
app.use("/api/v1/jobs", jobRouter)

export default app
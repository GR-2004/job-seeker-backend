import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    recruiterGetAllApplications,
    jobSeekerGetAllApplications,
    jobSeekerDeleteApplication,
    postApplication
} from "../controllers/application.controller.js";

const router = Router();

//secured routes
router.route("/recruiter/getAllApplications").get(verifyJWT, recruiterGetAllApplications)
router.route("/jobSeeker/getAllApplications").get(verifyJWT, jobSeekerGetAllApplications)
router.route("/deleteApplication/:id").delete(verifyJWT, jobSeekerDeleteApplication)
router.route("/postApplication/:jobID").post(verifyJWT, upload.single("resume"), postApplication)

export default router
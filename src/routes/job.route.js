import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    getAllJobs,
    postJob
} from "../controllers/job.controller.js";

const router = Router();

//secured routes
router.route("/getAllJobs").get(verifyJWT, getAllJobs);
router.route("/postjob").post(verifyJWT, postJob)

export default router
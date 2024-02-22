import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    getAllJobs,
    postJob,
    getMyPostedJobs,
    updateJob,
    deleteJob
} from "../controllers/job.controller.js";

const router = Router();

//secured routes
router.route("/postJob").post(verifyJWT, postJob)
router.route("/updatejob/:id").patch(verifyJWT, updateJob)
router.route("/deleteJob/:id").delete(verifyJWT, deleteJob)
router.route("/getMyPostedJobs").get(verifyJWT, getMyPostedJobs)
router.route("/getAllJobs").get(verifyJWT, getAllJobs);

export default router
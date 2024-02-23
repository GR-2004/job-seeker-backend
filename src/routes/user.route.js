import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    refreshAccessToken,
    updateUserProfile,
    getUserProfile,
    getHistory,
    getCurrentUser
} from "../controllers/user.controller.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-account").patch(verifyJWT, updateUserProfile);
router.route("/c/:username").get(verifyJWT, getUserProfile);
router.route("/history").get(verifyJWT, getHistory);
router.route("/getUser").get(verifyJWT, getCurrentUser); //done


export default router
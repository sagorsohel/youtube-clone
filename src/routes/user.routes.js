import { Router } from "express";
import {
  getUserChannel,
  loginUser,
  logoutUser,
  registerUser,
  watchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/get-user-channel/:username").get(verifyJWT, getUserChannel);
router.route("/watch-history").get(verifyJWT, watchHistory);


export default router;

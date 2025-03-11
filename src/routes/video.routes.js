import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadVideo } from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route("/upload").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbFile", maxCount: 1 },
  ]),
  uploadVideo
);

export default videoRouter;

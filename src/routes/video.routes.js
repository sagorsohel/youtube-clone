import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { uploadVideo } from "../controllers/video.controller";

const videoRouter = Router();

videoRouter.route("/video/upload").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbFile", maxCount: 1 },
  ]),
  uploadVideo
);

export default videoRouter;

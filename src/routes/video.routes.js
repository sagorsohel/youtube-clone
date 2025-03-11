import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideos, uploadVideo } from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route("/upload").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbFile", maxCount: 1 },
  ]),
  uploadVideo
);
videoRouter.route("/get-videos").get(
  verifyJWT,

  getVideos
);

export default videoRouter;

import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getVideos,
  updateVideo,
  uploadVideo,
} from "../controllers/video.controller.js";

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
videoRouter.route("/update-video/:id").patch(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbFile", maxCount: 1 },
  ]),
  updateVideo
);

export default videoRouter;

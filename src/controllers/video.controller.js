import Video from "../models/video.model.js";
import uploadCloudinary from "../services/clodinary.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get videos
export const getVideos = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const numberSkip = parseInt(skip) || 0;
  const numberLimit = parseInt(limit) || 10;
  const videos = await Video.find().skip(numberSkip).limit(numberLimit);

  const totalVideos = await Video.countDocuments();
  const data = {
    videos,
    totalVideos,
  };
  res
    .status(200)
    .json(new apiResponse(200, "Videos fetched successfully", data));
});

// Upload video
export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoFile = req.files.videoFile[0];
  const thumbFile = req.files.thumbFile[0];

  const { user } = req;

  //   check data from the request

  if (!title) {
    return res.status(400).json(new apiErrors(400, "Please provide a title"));
  }

  if (!videoFile?.path) {
    return res
      .status(400)
      .json(new apiErrors(400, "Please upload a video file"));
  }

  if (!thumbFile?.path) {
    return res
      .status(400)
      .json(new apiErrors(400, "Please upload a thumbnail file"));
  }

  //   save the video to the database

  const video = await uploadCloudinary(videoFile?.path);
  const thumb = await uploadCloudinary(thumbFile?.path);

  const newVideo = new Video({
    videoFile: video?.url,
    thumbFile: thumb?.url,
    title,
    description,
    owner: user?._id,
    duration: video?.duration,
  });

  const savedVideo = await newVideo.save();

  res
    .status(200)
    .json(new apiResponse(200, "Video uploaded successfully", savedVideo));
});


export const deleteVideo= asyncHandler(async (req, res) => {})
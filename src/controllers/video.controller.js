import Video from "../models/video.model.js";
import uploadCloudinary from "../services/clodinary.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Helper function to extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const fileWithExt = parts.pop();
  const publicId = fileWithExt.split(".")[0];
  return publicId;
};
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

export const updateVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  const video = await Video.findById(id);
  const videoFile = req.files?.videoFile?.[0];
  const thumbFile = req.files?.thumbFile?.[0];

  if (!video) {
    return res.status(404).json(new apiErrors(404, "Video not found"));
  }

  let videoData, thumbData;

  // Upload new video if provided
  if (videoFile) {
    videoData = await uploadCloudinary(videoFile.path);

    // Delete old video from Cloudinary
    if (video.videoFile) {
      const oldVideoPublicId = extractPublicId(video.videoFile);
      await cloudinary.uploader.destroy(oldVideoPublicId, {
        resource_type: "video",
      });
    }
  }

  // Upload new thumbnail if provided
  if (thumbFile) {
    thumbData = await uploadCloudinary(thumbFile.path);
    fs.unlinkSync(thumbFile.path); // Remove file after uploading

    // Delete old thumbnail from Cloudinary
    if (video.thumbFile) {
      const oldThumbPublicId = extractPublicId(video.thumbFile);
      await cloudinary.uploader.destroy(oldThumbPublicId);
    }
  }

  // Update the video in the database
  const updatedVideo = await Video.findByIdAndUpdate(
    id,
    {
      title,
      description,
      videoFile: videoData?.url || video.videoFile, // Keep old if no new upload
      thumbFile: thumbData?.url || video.thumbFile, // Keep old if no new upload
    },
    { new: true }
  );

  res
    .status(200)
    .json(new apiResponse(200, "Video updated successfully", updatedVideo));
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).json(new apiErrors(404, "Video not found"));
  }

  // Delete video from Cloudinary
  if (video.videoFile) {
    const videoPublicId = extractPublicId(video.videoFile);
    await cloudinary.uploader
      .destroy(videoPublicId, { resource_type: "video" })
      .catch((err) => console.error(err));
  }

  // Delete thumbnail from Cloudinary
  if (video.thumbFile) {
    const thumbPublicId = extractPublicId(video.thumbFile);
    await cloudinary.uploader
      .destroy(thumbPublicId)
      .catch((err) => console.error(err));
  }

  // Delete video from the database
  await Video.findByIdAndDelete(id);

  res.status(200).json(new apiResponse(200, "Video deleted successfully"));
});

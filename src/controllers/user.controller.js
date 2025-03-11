import mongoose from "mongoose";
import User from "../models/user.model.js";
import uploadCloudinary from "../services/clodinary.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// generate access token and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
  console.log(`Generating tokens for user: ${userId}`);
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new apiErrors(500, "Token generation failed");
  }
};

// register user
export const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //   check required fields
    const missingFields = ["name", "email", "password"].filter(
      (field) => !req.body[field]
    );

    if (missingFields.length) {
      return res.status(400).json(new apiErrors(400, `Missing fields: ${missingFields.join(", ")}`));
    }

    //   check if user already exists
    const existedUser = await User.findOne({
      $or: [{ email: email }],
    });
    if (existedUser) {
      return res.status(409).json(new apiErrors(409, "User already exists"));
    }

    //   check if avatar is uploaded
    const avatarFile = req.files?.avatar[0]?.path;
    if (!avatarFile) {
      return res.status(400).json(new apiErrors(400, "Avatar is required"));
    }
    const avatar = await uploadCloudinary(avatarFile);
    if (!avatar || !avatar.url) {
      return res.status(501).json(new apiErrors(501, "Avatar upload failed"));
    }

    //   create user
    const user = await User.create({
      name,
      email,
      password,
      avatar: avatar.url,
    });
    //   check if user is created
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    //   check if user is created
    if (!createdUser) {
      return res.status(500).json(new apiErrors(500, "User creation failed"));
    }
    //  return response
    return res.status(201).json(new apiResponse(201, createdUser, "User created", true));
  } catch (error) {
    next(error);
  }
});

// login user
export const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check required fields
    const missingFields = ["email", "password"].filter(
      (field) => !req.body[field]
    );

    console.log(email);

    if (missingFields.length) {
      return res.status(400).json(new apiErrors(400, `Missing fields: ${missingFields.join(", ")}`));
    }
    // check if user exists
    const user = await User.findOne({
      $or: [{ email: email }],
    });
    console.log(user);
    if (!user) {
      return res.status(404).json(new apiErrors(404, "User not found"));
    }
    // check if password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json(new apiErrors(401, "Invalid credentials"));
    }
    // generate access token and refresh token
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const loggedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new apiResponse(200, "Login successful", {
          user: loggedUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    next(error);
  }
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  // remove refresh token from user
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "Logged out",
    });
});

// get user channel profile
export const getUserChannel = asyncHandler(async (req, res) => {
  const { username } = req.params.username;

  if (!username?.trim()) {
    res.status(400).json(new apiErrors(400, "Username is required"));
  }
  const channel = await User.aggregate([
    {
      $match: { userName: username },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriptions",
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
        subscriptionCount: { $size: "$subscriptions" },
        isSubscribed: {
          if: { $in: [req.user._id, "$subscribers"] },
          then: true,
          else: false,
        },
      },
    },
    {
      $project: {
        userName: 1,
        isSubscribed: 1,
        subscriptionCount: 1,
        subscriberCount: 1,
        avatar: 1,
        email: 1,
        name: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiErrors(404, "Channel not found");
  }
  res.status(200).json(new apiResponse(200, "Channel found", channel[0]));
});

export const watchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    name: 1,
                    avatar: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, "Watch history", user[0].watchHistory));
});

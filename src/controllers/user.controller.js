import User from "../models/user.model.js";
import uploadCloudinary from "../services/clodinary.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //   check required fields
  const missingFields = ["name", "email", "password"].filter(
    (field) => !req.body[field]
  );

  if (missingFields.length) {
    throw new apiErrors(400, `Missing fields: ${missingFields.join(", ")}`);
  }

  //   check if user already exists
  const existedUser = await User.findOne({
    $or: [{ email: email }],
  });
  if (existedUser) {
    throw new apiErrors(409, "User already exists");
  }

  //   check if avatar is uploaded
  const avatarFile = req.files?.avatar[0]?.path;

  console.log(avatarFile)
  
  if (!avatarFile) {
    throw new apiErrors(400, "Avatar is required");
  }
  const avatar = await uploadCloudinary(avatarFile);
  if (!avatar || !avatar.url) {
    throw new apiErrors(501, "Avatar upload failed");
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
    throw new apiErrors(500, "User creation failed");
  }
  //  return response
  return res.status(201).json(new apiResponse(201, "User created", createdUser));
});
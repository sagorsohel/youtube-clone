import User from "../models/user.model.js";
import uploadCloudinary from "../services/clodinary.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// generate access token and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
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
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //   check required fields
  const missingFields = ["name", "email", "password"].filter(
    (field) => !req.body[field]
  );

  if (missingFields.length) {
    res
      .status(400)
      .json(new apiErrors(400, `Missing fields: ${missingFields.join(", ")}`));
  }

  //   check if user already existss
  const existedUser = await User.findOne({
    $or: [{ email: email }],
  });
  if (existedUser) {
    throw new apiErrors(409, "User already exists");
  }

  //   check if avatar is uploaded
  const avatarFile = req.files?.avatar[0]?.path;

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
  return res
    .status(201)
    .json(new apiResponse(201, "User created", createdUser));
});

// login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check required fields
  const missingFields = ["email", "password"].filter(
    (field) => !req.body[field]
  );

  console.log(email);

  if (missingFields.length) {
    res
      .status(400)
      .json(new apiErrors(400, `Missing fields: ${missingFields.join(", ")}`));
  }
  // check if user exists
  const user = await User.findOne({
    $or: [{ email: email }],
  });
  console.log(user);
  if (!user) {
    throw new apiErrors(404, "User not found");
  }
  // check if password is correct
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401).json(new apiErrors(401, "Invalid credentials"));
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

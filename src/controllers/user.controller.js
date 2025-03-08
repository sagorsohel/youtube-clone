import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (resizeBy, res) => {
  res.status(200).json({
    success: true,
    message: "Register User",
  });
});


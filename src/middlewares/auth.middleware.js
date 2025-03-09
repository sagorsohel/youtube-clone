import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    // TODO: Implement JWT verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

export default verifyJWT;

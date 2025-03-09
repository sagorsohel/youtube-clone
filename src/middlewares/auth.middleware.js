import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");
    console.log("token", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized token not found" }); // Add return to stop execution
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded', decoded);

    req.user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    console.log(req.user);
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

export default verifyJWT;

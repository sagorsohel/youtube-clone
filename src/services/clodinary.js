import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (filePath) => {
  if (!filePath) {
    console.error("File path is missing");
    return null;
  }
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    if (filePath) {
      fs.unlinkSync(filePath);
    }
    return null;
  }
};
export default uploadCloudinary;

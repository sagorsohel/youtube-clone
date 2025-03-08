import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (file) => {
  if (!file) {
    return null;
  }
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    fs.unlinkSync(file.path);
    return null;
  }
};
export default uploadCloudinary;
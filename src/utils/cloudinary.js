import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({
  path: './.env'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    // Upload the file to Cloudinary, automatically detecting the resource type.
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log('response', response)

    // Remove the locally saved temporary file after successful upload.
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    // Ensure the temporary file is removed even if the upload fails.
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) {
    console.log("Public ID is required to delete a file from Cloudinary.");
    return null;
  }

  try {
    // Await the destroy method with the correct public_id and resource_type
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return response;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
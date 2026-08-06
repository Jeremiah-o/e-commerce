import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const uploadSingleImage = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadSingleImage(file)),
    );

    res.status(200).json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
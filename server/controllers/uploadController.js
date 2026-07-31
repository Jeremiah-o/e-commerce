import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        }

        res.status(200).json({
          imageUrl: result.secure_url,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
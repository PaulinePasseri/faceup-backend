const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.photoFromFront) {
      return res.status(400).json({ result: false, error: "No file uploaded" });
    }

    const file = req.files.photoFromFront;

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "faceup" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.data);

    res.json({ result: true, url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary error:", err);
    res.status(500).json({ result: false, error: err.message });
  }
});

module.exports = router;
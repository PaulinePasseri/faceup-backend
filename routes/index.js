var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);
  const resultCloudinary = await cloudinary.uploader.upload(photoPath);

  if (!resultMove) {
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultCopy });
  }
  fs.unlinkSync(photoPath);
});

module.exports = router;

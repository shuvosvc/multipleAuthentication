const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const uploadFolder = "uploads";
const x = "../uploads/screenshot_19_1638364050519.png";
const productModel = require("../schemas/productModel");
const Product = new mongoose.model("Product", productModel);
const imagesss = mongoose.model("imagesss", { name: String });
//-------------------------------------------------------GET ALL THE ProductS
// router.get("/all", async (req, res) => {
//   try {
//     const products = await Product.find({});

//     res.status(200).json({
//       data: products,
//     });
//   } catch (err) {
//     console.log("There were a mongoose error");
//   }
// });
// router.get("/:id", async (req, res) => {
//   try {
//     const products = await Product.find({ _id: req.params.id });

//     res.status(200).json({
//       data: products,
//     });
//   } catch (err) {
//     console.log("There were a mongoose error");
//   }
// });

//----------------------------------------------------POST Product
//---img
///////////////auto storage control

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);

    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("_") +
      "_" +
      Date.now();

    cb(null, fileName + fileExt);
  },
});
// storage control end ----------------

const upload = multer({
  storage: storage,
  // dest: uploadFolder,
  limits: {
    fileSize: 5000000000000000000000,
  },

  preservePath: uploadFolder,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("only .jpg,.png,jpeg format allowed"));
      }
    } else {
      cb(new Error("wrong feild !!!"));
    }
  },
});

router.post(
  "/",
  upload.fields([{ name: "images", maxCount: 1 }]),

  async (req, res) => {
    try {
      console.log(req);

      res.status(200).json({
        message: "image was uploaded successfully!",
      });
    } catch (err) {
      console.log("There were a mongoose error");
    }
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const productSchema = require("../schemas/productSchema");
const Product = new mongoose.model("Product", productSchema);

const checkLogin = require("../middleware/checkLogin");
//-------------------------------------------------------GET ALL THE ProductS
router.get("/", async (req, res) => {
  try {
    const users = await Product.find({});

    res.status(200).json({
      data: users,
      message: "Success!!",
    });
  } catch (err) {
    console.log("There were a mongoose error");
  }
});
//-------------------------------------------------------GET ALL THE ProductS

//----------------------------------------------------POST Product

router.post("/", checkLogin, async (req, res) => {
  try {
    if (req.userRoll === "admin") {
      const newProduct = new Product({ ...req.body });

      await newProduct.save();
      console.log(newProduct);
      res.status(200).json({
        message: "Product was inserted successfully!",
      });
    } else {
      res.status(401).json({
        error: "Only admin can post new products!!!",
      });
    }
  } catch (err) {
    console.log("There were a mongoose error");
  }
});

//----------------------------------------------POST MULTIPLE Product
router.post("/ALL", async (req, res) => {
  try {
    await Product.insertMany(req.body, (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error",
        });
      } else {
        res.status(200).json({
          message: "Products ware inserted successfully",
        });
      }
    });
  } catch (err) {
    console.log("Their were a mongoose error");
  }
});
//---------------------------------------------------------------------PUT Product
router.put("/:id", async (req, res) => {
  try {
    const result = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: "inactive",
          title: req.body.title,
        },
      },
      { new: true, useFindAndModify: false },
      (err) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error",
          });
        } else {
          res.status(200).json({
            message: "Product was updated successfully",
          });
          console.log(req.body.title);
        }
      }
    );
  } catch (err) {
    console.log("Their were a mongoose error");
  }
});
//-------------------------------------------------------------delet Product
router.delete("/:id", async (req, res) => {
  try {
    await Product.deleteOne(
      { _id: req.params.id },

      (err) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error",
          });
        } else {
          res.status(200).json({
            message: "Product was updated successfully",
          });
        }
      }
    );
  } catch (err) {
    console.log("Their were a mongoose error");
  }
});

module.exports = router;

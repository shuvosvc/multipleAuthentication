const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../schemas/userModel");
const User = new mongoose.model("User", userSchema);
//-------------------------------------------------------signup
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(req.body.roll, req.body.userName);
    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      password: hashedPassword,
      roll: req.body.roll,
    });

    await newUser.save();
    res.status(200).json({
      message: "signup was  successfull",
    });
  } catch {
    res.status(500).json({
      message: "signup failed",
    });
  }
});
//-------------------------------------------------------login
router.post("/login", async (req, res) => {
  try {
    const tem_user = await User.find({ userName: req.body.userName });
    if (tem_user && tem_user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        tem_user[0].password
      );
      if (isValidPassword) {
        //..................generate token
        const token = jwt.sign(
          {
            userName: tem_user[0].userName,
            userId: tem_user[0]._id,
            userRoll: tem_user[0].roll,
          },
          process.env.JWT_SECRET
          // { expiresIn: "24h" }
        );
        res.status(200).json({
          access_token: token,
          message: "Login successful!",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed1",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed2",
      });
    }
  } catch {
    res.status(401).json({
      error: "Authentication failed2",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      data: users,
      message: "Success!!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "There was an error on the server side!!",
    });
  }
});
module.exports = router;

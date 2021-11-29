const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
//-------------------------------------------------------signup
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
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
    const tem_user = await User.find({ username: req.body.username });
    if (tem_user && tem_user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        tem_user[0].password
      );
      if (isValidPassword) {
        //..................generate token
        const token = jwt.sign(
          {
            username: tem_user[0].username,
            userId: tem_user[0]._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
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

router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).populate("todos");

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

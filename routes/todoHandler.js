const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const todoSchema = require("../schemas/todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);

const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

const checkLogin = require("../middleware/checkLogin");
//-------------------------------------------------------GET ALL THE TODOS
router.get("/", checkLogin, async (req, res) => {
  console.log(req.username);
  console.log(req.userId);
  try {
    await Todo.find({})
      .populate("user", "username -_id")
      .exec((err, data) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error!",
          });
        } else {
          res.status(200).json({
            result: data,
            message: "Success",
          });
        }
      });
  } catch (err) {
    console.log("There were a mongoose error");
  }
});
//-------------------------------------------------------GET ALL THE TODOS

//----------------------------------------------------POST TODO
// router.post("/", checkLogin, async (req, res) => {
//   const newTodo = new Todo({ ...req.body, user: req.userId });

//   try {
//     await newTodo.save((err) => {
//       if (err) {
//         res.status(500).json({
//           error: "There was a server side error",
//         });
//       } else {
//         res.status(200).json({
//           message: "Todo was inserted successfully",
//         });
//       }
//     });
//   } catch (err) {
//     console.log("There were a mongoose error");
//   }
// });

router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({ ...req.body, user: req.userId });

  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({
      message: "Todo was inserted successfully!",
    });
  } catch (err) {
    console.log("There were a mongoose error");
  }
});

//----------------------------------------------POST MULTIPLE TODO
router.post("/ALL", async (req, res) => {
  try {
    await Todo.insertMany(req.body, (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error",
        });
      } else {
        res.status(200).json({
          message: "Todos ware inserted successfully",
        });
      }
    });
  } catch (err) {
    console.log("Their were a mongoose error");
  }
});
//---------------------------------------------------------------------PUT TODO
router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
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
            message: "Todo was updated successfully",
          });
          console.log(req.body.title);
        }
      }
    );
  } catch (err) {
    console.log("Their were a mongoose error");
  }
});
//-------------------------------------------------------------delet TODO
router.delete("/:id", async (req, res) => {
  try {
    await Todo.deleteOne(
      { _id: req.params.id },

      (err) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error",
          });
        } else {
          res.status(200).json({
            message: "Todo was updated successfully",
          });
        }
      }
    );
  } catch (err) {
    console.log("Their were a mongoose error");
  }
});

module.exports = router;

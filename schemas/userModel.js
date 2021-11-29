const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },

  roll: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
});
module.exports = userSchema;

const mongoose = require("mongoose");
const productModel = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  brand: { type: String },
  price: { type: String },
  image: { type: String },
  description: { type: String },
  publish: {
    type: Boolean,
    default: false,
  },
});
module.exports = productModel;

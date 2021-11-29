const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const products = require("./routes/products");
const users = require("./routes/users");
const port = 3000;

const app = express();
dotenv.config();
app.use(express.json());

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/multiAuthtication", { useNewUrlParser: true })
  .then((res) => {
    // console.log(res);
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

//application routes----------------------------------------------------get start
app.use("/products", products);
app.use("/users", users);

//default errorhandler---------------------------------------------------------delet end
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

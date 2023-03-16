const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const Product = require("./models/product")
const productRoutes = require('./routes/products')
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");
mongoose.set("strictQuery", false);

const app = express();

mongoose.connect(`mongodb+srv://crud:${process.env.MONGO_PASS}@crud.fg66fgt.mongodb.net/Ecome-Store`).then(() => {
  console.log("Connected To Database")
}).catch((err) => {
  console.log(err)
  console.log("Connected Failed!");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use("/api/products", productRoutes)
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app

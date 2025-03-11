// installed module
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// custom module
const app = require("./index");

// config env file for storing some variables
dotenv.config({ path: "./config.env" });

// CONNECTING TO DATABASE
const DB = process.env.DATABASE.replace(/<PASSWORD>/g, process.env.PASSWORD);

mongoose
  .connect(DB)
  .then((conn) => {
    console.log("Databse connected successfully");
  })
  .catch((err) => {
    console.log(`Some error occured while connecting Database ${err}`);
  });

// listen to server
port = process.env.PORT || 5000;
app.listen(port,  "0.0.0.0", () => {
  console.log(`your app is running on ${port}`);
});

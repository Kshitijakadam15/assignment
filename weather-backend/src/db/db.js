const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Connect to DB
dotenv.config();
const db = mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected !!");
  })
  .catch((err) => console.log("Connection not successful " + err));

module.exports = db;

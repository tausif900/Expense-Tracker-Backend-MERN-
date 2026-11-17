const mongoose = require("mongoose");

// Method for establishing a connection with MogoDB.
const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection established with database");
  } catch (error) {
    console.log(error);
    console.log("Error while establishing connection");
  }
};

module.exports = connectionDB;

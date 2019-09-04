const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const chalk = require("chalk");
const log = console.log;

const connectDB = async () => {
  try {
    // await mongoose.connect(db, {
    //   useNewUrlParser: true,
    //   useCreateIndex: true
    // });

    await mongoose.connect("mongodb://127.0.0.1:27017/devcon", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    log(chalk.white.bgGreen.bold("SUCCESS:") + " MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

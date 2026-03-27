const mongoose = require("mongoose");

async function connectMongo(mongoUri) {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");
  } catch (err) {
    console.error("Error connect to MongoDB:", err);
    process.exit(1);
  }
}

module.exports = { connectMongo };
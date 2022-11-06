const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    gameID: String,
    history: [
      {
        gameID: String,
        points: Number
      }
    ]
  })
);

module.exports = User;
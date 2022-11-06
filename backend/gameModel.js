const mongoose = require("mongoose");

const Game = mongoose.model(
  "Game",
  new mongoose.Schema({
    gameID: String,
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    objects: [
        {
          object: String
        }
    ],
    photos: [
      {
        userEmail: String,
        photo: String //TODO: What type of object will the photo be?????
      }
    ],
    currentObjects: [
        {
            object: String
        }
    ]
  })
);

module.exports = Game;
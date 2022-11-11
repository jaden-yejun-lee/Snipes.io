const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    gameID: {
        type: String,
        required: true
    },
    players: [
        {
            userID: String
        }
    ],
    objects: [
        {
            object: String
        }
    ],
    // photos: [
    //   {
    //     userEmail: String,
    //     photo: String, //TODO: What type of object will the photo be?????
    //     required: true
    //   }
    // ],
    // currentObjects: [
    //     {
    //         object: String
    //     }
    // ]
}, { collection: 'games',
versionKey: false
})

module.exports = mongoose.model('Game', gameSchema)
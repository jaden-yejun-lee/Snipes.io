const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    gameID: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    // team1_pts: {
    //     type: Number,
    //     required: true
    // },
    // team1_pts: {
    //     type: Number,
    //     required: true
    // },


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
    team1: [
        {
            userID: String
        }
    ], 
    team2: [
        {
            userID: String
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
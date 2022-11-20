const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    gameID: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    // team1_pts: {
    //     type: Number,
    //     required: true
    // },
    // team1_pts: {
    //     type: String,
    //     required: true
    // },


    players: [
        {
            type: String
        }
    ],
    objects: [
        {
            type: String
        }
    ],
    team1: [
        {
            type: String
        }
    ], 
    team2: [
        {
            type: String
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
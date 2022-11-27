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

    leaderboard: [{
        userID: {
            type: String
        },
        points: {
            type: Number
        }
    }],
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
    // photo array
    photos: [
        {
            object: {
                type: String, 
            },
            image: {
                data: Buffer,
                contentType: String
            },
            user: {
                type: String, 
            },
            timestamp: {
                type: String,
            }
        }
    ], 
}, { collection: 'games',
versionKey: false
})
module.exports = mongoose.model('Game', gameSchema)
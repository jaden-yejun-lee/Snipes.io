const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    gameID: {
        type: String,
        required: false,
    },
    points: {
        type: Number,
        required: true,
        default: 0,
    },
}, { collection: 'userHistory',
versionKey: false
})

module.exports = mongoose.model('userHistory', historySchema)
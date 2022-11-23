const mongoose = require('mongoose')

//schema model for history
const historySchema = new mongoose.Schema({
    gameID: {
        type: String,
        required: false,
        //default: "", ---> "" is a falsy value and thus is invalid 
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
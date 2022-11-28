const mongoose = require('mongoose')
const historyModel = require('./historyModel')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    currentGameID: {
        type: mongoose.Schema.Types.ObjectId,
        require: false
    },
    currentPoints: {
        type: Number,
        require: false
    },
    history: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'userHistory'
        }
    ], 
    
}, { collection: 'users',
versionKey: false 
})

module.exports = mongoose.model('users', userSchema)
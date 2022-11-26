const mongoose = require('mongoose')
const historyModel = require('./historyModel')

//The schema model for users
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
        // default: null
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

//Exporting the model that associates the User collection with sale schema
//NOTE: if you change 'Sale' to something else, it will try to access a different collection in the DB
module.exports = mongoose.model('users', userSchema)
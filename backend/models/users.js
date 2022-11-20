const mongoose = require('mongoose')

//reference: https://stackoverflow.com/questions/55878496/mongoose-populate-on-two-dimensional-array
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
})

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
    history: { type: mongoose.Schema.Types.ObjectId, ref: 'userHistory' }, 
    
}, { collection: 'users',
versionKey: false
})

//Exporting the model that associates the User collection with sale schema
//NOTE: if you change 'Sale' to something else, it will try to access a different collection in the DB
module.exports = mongoose.model('users', userSchema)
module.exports = mongoose.model('userHistory', historySchema)
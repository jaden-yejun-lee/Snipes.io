const mongoose = require('mongoose');

const PhotoSchema = mongoose.Schema({
    object: {
        type: String, 
        required: true
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
        required: true
    }

})

module.exports = PhotoModel =  mongoose.model('photos', PhotoSchema)
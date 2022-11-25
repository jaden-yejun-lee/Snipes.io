const mongoose = require('mongoose');

const PhotoSchema = mongoose.Schema({
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

})

module.exports = PhotoModel =  mongoose.model('photos', PhotoSchema)
const mongoose = require('mongoose');

const PhotoSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    }
})

module.exports = PhotoModel =  mongoose.model('photos', PhotoSchema)
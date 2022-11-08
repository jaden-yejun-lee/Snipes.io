const mongoose = require('mongoose')

const salesSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Sale', salesSchema)
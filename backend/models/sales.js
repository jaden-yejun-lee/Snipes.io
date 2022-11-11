const mongoose = require('mongoose')

//The schema model for Sale
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
        required: true,
        default: Date.now
    }, 
    
}, { collection: 'sales',
versionKey: false
})

//Exporting the model that associates the Sale collection with sale schema
//NOTE: if you change 'Sale' to something else, it will try to access a different collection in the DB
module.exports = mongoose.model('Sale', salesSchema)
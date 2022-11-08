const express = require('express')
const router = express.Router()
const Sale = require('../models/sales')

router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find()
        res.json(sales)
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
    res.send('Hello world')
})

router.get('/:id', (req, res) => {
    res.send(req.params.id)
})

module.exports = router
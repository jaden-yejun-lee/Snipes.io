const express = require('express')
const router = express.Router()
const Sale = require('../models/sales')

//GET: Get all the sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find()
        res.json(sales)
        console.log("Get request success")
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

//POST: posting a new sale
router.post('/', async (req, res) => {
    const sale = new Sale({
        item: req.body.item,
        price: req.body.price,
        quantity: req.body.quantity,
        date: req.body.date
    })

    try {
        const newSale = await sale.save()
        res.status(201).json(newSale)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//STILL NOT DONE
router.get('/:id', async (req, res) => {
    const post = await Sale.findById(req.params.postID);
    res.json(post)

})

//DELETE: Deleting a sale with postID
router.delete('/:postID', async (req, res) => {
    try {
        const removedPost = await Sale.deleteOne({_id: req.params.postID})
        res.json(removedPost)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    
})

module.exports = router
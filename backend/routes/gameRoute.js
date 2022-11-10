const express = require('express')
const router = express.Router();
const Game = require('../models/gameModel')



router.get('/', async (req, res) => {
    try {
        const games = await Game.find()
        res.json(games)
        console.log("Get request success")
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res) => {
    const game = new Game({
        gameID: req.body.gameID,
        players: req.body.players,
        objects: req.body.objects
    })

    try {
        const newGame = await game.save()
        res.status(201).json(newGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/getObjects', async (req, res) => {
    try {
        const curr_game = await Game.findOne({"gameID": req.body.gameID})
        res.json(curr_game.objects)
        

        console.log("Post request success")
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

router.post('/addObject', async (req, res) => {
    try {
        const curr_game = await Game.findOne({"gameID": req.body.gameID})
        curr_game.objects.push({"object":req.body.object})
        curr_game.save()

        console.log("Add Object success")
        res.send("Add Object success")
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})


module.exports = router
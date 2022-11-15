const express = require('express')
const router = express.Router();
const Game = require('../models/gameModel')


// get the attributes of a game
router.get('/:gameID', async (req, res) => {
    try {
        const game = await Game.findOne({"gameID": req.params.gameID})
        res.json(game)
        console.log("Get request success")
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

// Create a new empty game
router.post('/:gameID', async (req, res) => {
    // GENERATE A GAMEID HERE AND REMOVE FROM URL

    const game = new Game({
        gameID: req.params.gameID,
        players: [],
        objects: []
    })

    try {
        const newGame = await game.save()
        res.status(201).json(newGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// add an object to the game
router.post('/:gameID/addObject', async (req, res) => {
    try {
        const curr_game = await Game.findOne({"gameID": req.params.gameID})
        curr_game.objects.push({"object":req.body.object})
        curr_game.save()

        res.send("Add Object success")
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})


router.post('/:gameID/target', async (req, res) => {
    try {
        const curr_game = await Game.findOne({"gameID": req.params.gameID})
        curr_game.objects.push({"object":req.body.object})
        curr_game.save()

        res.send("Add Object success")
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

router.delete('/:gameID/target', async (req, res) => {
    try {
        const curr_game = await Game.findOne({"gameID": req.params.gameID})
        var deleted = false
        for (let i=0; i < curr_game.objects.length; i++){
            if ((curr_game.objects[i].object) == req.body.object){
                curr_game.objects.splice(i, 1)
                deleted = true
                break
            }
        }
        if (!deleted){
            res.send("Object to be deleted not found")
        }
        else{
            curr_game.save()
            res.send("Remove Object success")
        }
        
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

router.delete('/:gameID', async (req, res) => {
    try {
        const removedGame = await Game.deleteOne({"gameID": req.params.gameID})
        res.json(removedGame)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


module.exports = router
const express = require('express')
const router = express.Router();
const Game = require('../models/gameModel')


// get the attributes of a game
router.get('/:gameID', async (req, res) => {
    try {
        const game = await Game.findOne({"gameID": req.params.gameID})
        if (!game) {
            return res.status(400).json({message: "game does not exist"});
        }
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
        status: "open",
        players: [],
        objects: [],
        team1: [],
        team2: []
    })

    try {
        const newGame = await game.save()
        res.status(201).json(newGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// add an object to the game 
router.post('/:gameID/target', async (req, res) => {
    try {
        const curr_game = await Game.findOne({"gameID": req.params.gameID})
        curr_game.objects.push({"object":req.body.object})
        curr_game.save()

        res.status(201).json(curr_game)
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

// delete an object from a game
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
            res.status(201).json(curr_game)
        }
        
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

// delete a game
router.delete('/:gameID', async (req, res) => {
    try {
        const removedGame = await Game.deleteOne({"gameID": req.params.gameID})
        res.json(removedGame)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// add player to a team or switch the player from a team
router.post('/:gameID/assignPlayer/:team_number', async (req, res) => {
    try {
        // change to decryt jwt token
        // console.log(typeof req.headers)
        let username = "mike"

        const curr_game = await Game.findOne({"gameID": req.params.gameID})
        if (curr_game.status == "closed"){
            res.send("Game is closed")
            return
        }
        if (req.body.newPlayer == "True"){
            // add to all players array
            curr_game.players.push({"userID": username})
        }
        else{
            // remove from all the teams
            for(let i = 0; i < curr_game.team1.length; i++){
                if ((curr_game.team1[i].userID) == username){
                    curr_game.team1.splice(i, 1)
                    break
                }
            }
            for(let i = 0; i < curr_game.team2.length; i++){
                
                if ((curr_game.team2[i].userID) == username){
                    curr_game.team2.splice(i, 1)
                    break
                }
            }
        }
        if (req.params.team_number == "1"){
            curr_game.team1.push({"userID" : username})
        }
        else{
            curr_game.team2.push({"userID" : username})
        }
        // console.log(curr_game.team2.indexOf({"userID": username}))
        curr_game.save()
        res.status(201).json(curr_game)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// delete player from game if they leave
router.delete('/:gameID/assignPlayer', async (req, res) => {
    try {
        // change to decryt jwt token
        let username = "mike"
        const curr_game = await Game.findOne({"gameID": req.params.gameID})
        for(let i = 0; i < curr_game.team1.length; i++){
            if ((curr_game.team1[i].userID) == username){
                curr_game.team1.splice(i, 1)
                break
            }
        }

        for(let i = 0; i < curr_game.team2.length; i++){
            if ((curr_game.team2[i].userID) == username){
                curr_game.team2.splice(i, 1)
                break
            }
        }

        for(let i = 0; i < curr_game.players.length; i++){
            if ((curr_game.players[i].userID) == username){
                curr_game.players.splice(i, 1)
                break
            }
        }
        curr_game.save()
        res.status(201).json(curr_game)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



module.exports = router
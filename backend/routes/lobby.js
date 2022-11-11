// Route for generating a random lobby code

const express = require('express')
const router = express.Router()
const Game = require('../models/game')


    // if create game is pressed, then it should generate a random 5 digit number and create a new game with that gameID
    
    // basically do the same thing as user create
    router.post('/createGame', async (req, res) => {
        
        // returns a random int from 10000 to 99999
        var x;
        x = Math.floor(Math.random() * 89999) + 10000;

        // create a new game
        const game = new Game({
            code: x
        })

        // send new game to response if no errors
        try {
           const newGame = await Game.save()
            res.status(201).json(newGame)
        } catch {
            res.status(400).json({ message: 'Unable to create new game'})
        }

    })
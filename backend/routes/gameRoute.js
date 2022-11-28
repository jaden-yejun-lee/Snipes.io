const express = require('express')
const router = express.Router();
const Game = require('../models/gameModel')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Hist = require('../models/historyModel')
const multer = require('multer')
const fs = require('fs')
const Photo = require('../models/photo')


// get the attributes of a game
router.get('/:gameID', async (req, res) => {
    try {
        let username = jwt.verify(req.headers['authorization'].split(' ')[1], "boopoop").email

        const game = await Game.findOne({ "gameID": req.params.gameID })
        if (game == null) {
            res.status(404).json({ message: "No Game ID Found" })
            return
        }

        let userFound = false

        for (let i = 0; i < game.players.length; i++) {
            if (game.players[i].userID == username) {
                userFound = true
                break;
            }
        }

        if (!userFound && game.state != "open") {
            res.status(403).send("Access denied")
            return
        }

        res.status(200).json(game)


    } catch (err) {
        if (err.message == "jwt expired"){
            res.status(401).json({message: err.message})
        }
        else{
            res.status(500).json({message: err.message})
        }
    }
})


// Create a new empty game
router.post('/', async (req, res) => {
    // GENERATE A GAMEID HERE AND REMOVE FROM URL
    var generated_id = Math.floor(Math.random() * 89999) + 10000;
    var game1 = await Game.findOne({ "gameID": String(generated_id) })
    while (game1 != null) {
        generated_id = Math.floor(Math.random() * 89999) + 10000;
        game1 = await Game.findOne({ "gameID": String(generated_id) })
    }

    const game = new Game({
        gameID: generated_id,
        state: "open",
        leaderboard: [],
        players: [],
        objects: [],
        team1: [],
        team2: [],
        photos: []
    })

    try {
        const newGame = await game.save()
        res.status(201).json(newGame)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// update game state
router.post('/:gameID/state', async (req, res) => {
    try {
        const curr_game = await Game.findOne({ "gameID": req.params.gameID })

        if (curr_game == null) {
            res.status(404).json({ message: "No Game ID Found" })
            return
        }

        //1. First verify that this user is valid to alter game state
        let username = jwt.verify(req.headers['authorization'].split(' ')[1], "boopoop").email
        let userFound = false

        for (let i = 0; i < curr_game.players.length; i++) {
            if (curr_game.players[i].userID == username) {
                userFound = true
                break;
            }
        }
        if (!userFound) {
            res.status(403).send("Access denied")
            return
        }

        //2. after user is verified, can change game state    
        //if done with target selecting, start selection for objects for the game
        if (curr_game.state == 'target_select' && req.body.state == "in_progress") {
            //check at least 1 object
            if (curr_game.objects.length == 0) {
                res.status(400).json({ message: "No objects." })
                return
            }

            numTargets = 3
            //only have numTargets left in object array
            toRemove = curr_game.objects.length - numTargets
            for (var i = 0; i < toRemove; i++) {
                curr_game.objects.pop()
            }
        }

        //if we want to end the game, update all user's histories then delete the game
        else if (curr_game.state == 'in_progress' && req.body.state == "game_over") {
            gameid = curr_game.gameID
            //create new history object for each user and add to their array
            for (let i = 0; i < curr_game.players.length; i++) {
                player = curr_game.players[i].userID

                let playerPoints = 0
                for (let j = 0; j < curr_game.leaderboard.length; j++) {
                    if (player == curr_game.leaderboard[i].userID) {
                        playerPoints = curr_game.leaderboard[i].points
                        break
                    }
                }
                playerPoints = playerPoints * 100

                try {
                    const user = await User.findOne({ "name": player })
                    const newHist = new Hist({ gameID: gameid, points: playerPoints })
                    await newHist.save();

                    user.history.push(newHist)
                    await user.save();
                    //console.log(user.history)
                    console.log("Successfully added new history to a given user.")
                } catch (err) {
                    console.log("Unable to add new history.")
                    res.status(500).json({ message: err.message })
                    return
                }
            }
        }

        //update current state
        curr_game.state = req.body.state

        curr_game.save()
        res.status(200).json(curr_game)

    } catch (err) {
        if (err.message == "jwt expired"){
            res.status(401).json({message: err.message})
        }
        else{
            res.status(500).json({message: err.message})
        }
    }
})

// add an object to the game 
router.post('/:gameID/target', async (req, res) => {
    let { object } = req.body;
    try {
        const curr_game = await Game.findOne({ "gameID": req.params.gameID })

        if (curr_game == null) {
            res.status(404).json({ message: "No Game ID Found" })
            return
        }

        for (let i = 0; i < curr_game.objects.length; i++) {
            if ((curr_game.objects[i].object) == object) {
                res.status(400).send("Already inputted this object.")
                return;
            }
        }

        //We want to add the object to a random index.
        //1. Create any random number between min (included) and max (not included): Math.random() * (max - min) + min;
        randomSeededIndex = Math.random() * (curr_game.objects.length - 0) + 0;
        //2. insert at index: <array-name>.splice(<position-to-insert-items>,0,<item-1>,<item-2>,..,<item-n>)
        curr_game.objects.splice(randomSeededIndex, 0, { "object": object })
        curr_game.save()
        //console.log(curr_game.objects)
        res.status(201).json(curr_game)
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({ message: err.message })
    }
})

// delete an object from a game
router.delete('/:gameID/target/:target', async (req, res) => {
    try {
        const curr_game = await Game.findOne({ "gameID": req.params.gameID })

        if (curr_game == null) {
            res.status(404).json({ message: "No Game ID Found" })
            return
        }

        var deleted = false
        for (let i = 0; i < curr_game.objects.length; i++) {
            if ((curr_game.objects[i].object) == req.params.target) {
                curr_game.objects.splice(i, 1)
                deleted = true
                break
            }
        }
        if (!deleted) {
            res.status(404).send("Deleted Object not found")
        }
        else {
            curr_game.save()
            res.status(200).json(curr_game)
        }
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})

// delete a game
router.delete('/:gameID', async (req, res) => {
    try {
        const removedGame = await Game.deleteOne({ "gameID": req.params.gameID })
        res.status(200).json(removedGame)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// add player to a team or switch the player from a team
router.post('/:gameID/assignPlayer/:team_number', async (req, res) => {
    try {
        // change to decryt jwt token
        // console.log(typeof req.headers)
        let username = jwt.verify(req.headers['authorization'].split(' ')[1], "boopoop").email
        
        const curr_game = await Game.findOne({ "gameID": req.params.gameID })

        if (curr_game == null) {
            res.status(404).json({ message: "No Game ID Found" })
            return
        }

        if (curr_game.state != "open") {
            res.status(403).json({ message: "Game is closed" })
            return
        }

        var newPlayer = true

        for (let i = 0; i < curr_game.players.length; i++) {
            if ((curr_game.players[i].userID) == username) {
                newPlayer = false
                break
            }
        }

        if (newPlayer) {
            // add to all players array
            curr_game.players.push({ "userID": username })
            curr_game.leaderboard.push({ "userID": username, points: 0, team: req.params.team_number})
        }
        else {
            // remove from all the teams
            for (let i = 0; i < curr_game.team1.length; i++) {
                if ((curr_game.team1[i].userID) == username) {
                    curr_game.team1.splice(i, 1)
                    break
                }
            }
            for (let i = 0; i < curr_game.team2.length; i++) {
                if ((curr_game.team2[i].userID) == username) {
                    curr_game.team2.splice(i, 1)
                    break
                }
            }
            for (let i = 0; i < curr_game.leaderboard.length; i++) {
                if ((curr_game.leaderboard[i].userID) == username) {
                    curr_game.leaderboard[i].team = req.params.team_number
                    break
                }
            }
        }
        if (req.params.team_number == "1") {
            curr_game.team1.push({ "userID": username })
        }
        else {
            curr_game.team2.push({ "userID": username })
        }
        curr_game.save()
        res.status(200).json(curr_game)

    } catch (err) {
        if (err.message == "jwt expired"){
            res.status(401).json({message: err.message})
        }
        else{
            res.status(500).json({message: err.message})
        }
    }
})

// delete player from game if they leave
router.delete('/:gameID/assignPlayer', async (req, res) => {
    try {
        // change to decryt jwt token
        let username = jwt.verify(req.headers['authorization'].split(' ')[1], "boopoop").email
        const curr_game = await Game.findOne({ "gameID": req.params.gameID })
        if (curr_game == null) {
            res.status(404).json({ message: "No Game ID Found" })
            return
        }
        for (let i = 0; i < curr_game.team1.length; i++) {
            if ((curr_game.team1[i].userID) == username) {
                curr_game.team1.splice(i, 1)
                break
            }
        }

        for (let i = 0; i < curr_game.team2.length; i++) {
            if ((curr_game.team2[i].userID) == username) {
                curr_game.team2.splice(i, 1)
                break
            }
        }

        for (let i = 0; i < curr_game.players.length; i++) {
            if ((curr_game.players[i].userID) == username) {
                curr_game.players.splice(i, 1)
                break
            }
        }

        for (let i = 0; i < curr_game.leaderboard.length; i++) {
            if ((curr_game.leaderboard[i].userID) == username) {
                curr_game.leaderboard.splice(i, 1)
                break
            }
        }
        
        //if game state == game_over AND if players array length == 0, then delete the entire gameModel
        if (curr_game.state == "game_over" && curr_game.players.length == 0) {
            try {
                const removedGame = await Game.deleteOne({ "gameID": req.params.gameID })
                console.log("Successfully removed game " + req.params.gameID + " now that it is over.")
                res.status(200).json(removedGame)
                return
        
            } catch (err) {
                res.status(500).json({ message: err.message })
            }
        }

        curr_game.save()
        res.status(200).json(curr_game)

    } catch (err) {
        if (err.message == "jwt expired"){
            res.status(401).json({message: err.message})
        }
        else{
            res.status(500).json({message: err.message})
        }
    }
})

// stores photos on local device
const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});

// uploading files on mongodb
const upload = multer({
    storage: Storage
}).single('image')  // this parameter has to match postman key which should be "image" and then select file for value

// post a photo to db 
router.post('/:gameID/photos', async (req, res) => {
    try {
        let username = jwt.verify(req.headers['authorization'].split(' ')[1], "boopoop").email

        const curr_game = await Game.findOne({ "gameID": req.params.gameID })

        if (curr_game == null) {
            res.status(404).json({ message: "No Game ID Found" })
            return
        }
        upload(req, res, (err) => {
            if (err) {
                res.status(500).json({ message: "Could Not Uplaod Photo" })
            }
            else {
                if (!req.file) {
                    res.status(400).json({ message: "No photo selected" })
                    return
                }
                const newPhoto = new Photo({
                    object: req.body.object,
                    image: {
                        data: fs.readFileSync('./uploads/' + req.file.filename), // read in file from uploads folder (which gets automatically created)
                        contentType: 'image/png'
                    },
                    user: username,
                    timestamp: Date.now()
                })

                curr_game.photos.push(newPhoto)

                // deletes file from local so that unnecessary space is not used in holding pictures in upload folder
                fs.unlink('./uploads/' + req.file.filename, (err) => {
                    if (err) {
                        res.status(500).json({ message: "Could Not Delete Photo From Local Device" })
                        return
                    }
                })

                // update game leaderboard
                for (let i = 0; i < curr_game.leaderboard.length; i++) {
                    if (curr_game.leaderboard[i].userID === username) {
                        curr_game.leaderboard[i].points++;
                        userFound = true;
                        break;
                    }
                }

                curr_game.save()
                    .then(() => res.status(200).json(curr_game))
                    .catch((err) => res.status(err).json({ message: "Current Game Could Not Be Saved Due To Photo" }));
            }
        })
    } catch (err) {
        if (err.message == "jwt expired"){
            res.status(401).json({message: err.message})
        }
        else{
            res.status(500).json({message: err.message})
        }
    }
})

// NEED TO WORK ON GET ALL

//GET: Get a photo with id
router.get('/:gameID/photos/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ "gameID": req.params.gameID })

        if (game == null) {
            res.status(504).json({ message: "No Game ID Found" })
            return
        }

        for (let i = 0; i < game.photos.length; i++) {
            if (game.photos[i]._id.toString() == req.params.id) {
                res.status(200).json(game.photos[i])
            }
        }
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({ message: err.message })
    }
})
module.exports = router
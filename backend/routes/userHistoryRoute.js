const express = require('express')
const router = express.Router();
const User = require('../models/userModel')
const Hist = require('../models/historyModel')

//retrieve a user's points for a specific game
router.get('/', async (req, res) => {
    let {username, gameID} = req.body;
    try {
        const user = await User.findOne({"name": username})
        found = false;
        var hist = null;

        for (var i = 0; i < user.history.length; i++){
            //search each history document for the specific game
            hist = await Hist.findById(user.history[i])
            if (hist.gameID === gameID){
                found = true;
                break;
            }
        }

        if(found){
            console.log(hist)
            res.json(hist)
            console.log("Successfully returned points of given game.")
        }
        else {
            console.log("Unable to find specific game.")
            res.status(500).json({message: err.message})
        }
    } catch (err) {
        console.log("Unable to find specific game.")
        res.status(500).json({message: err.message})
    }
})

//retrieve top scores of one player
router.get('/all', async (req, res) => {
    let {username} = req.body;
    try {
        const user = await User.findOne({"name": username})
        var points = [];
        for (var i = 0; i < user.history.length; i++){
            //for each history document
            const hist = await Hist.findById(user.history[i])
            points.push(hist.points)
        }
        points.sort()
        console.log(points)
        res.json(user.history)
        console.log("Successfully return all history (sorted) of given user.")
    } catch (err) {
        console.log("Unable to display history.")
        res.status(500).json({message: err.message})
    }
})

//add a history to a specific user
router.post('/', async (req, res) => {
    let {username, gameID, points} = req.body;
    try {
        const user = await User.findOne({"name": username})
        const newHist = new Hist({gameID: gameID, points: points})
        await newHist.save(); 
        
        //console.log(user.history)
        if (user.history === null){
            console.log("null history")
            user.history = []
        }
        user.history.push(newHist)
        await user.save();
        
        res.json(user.history)
        console.log("Successfully added new history to a given user.")
    } catch (err) {
        console.log("Unable to add new history.")
        res.status(500).json({message: err.message})
    }
})

module.exports = router;
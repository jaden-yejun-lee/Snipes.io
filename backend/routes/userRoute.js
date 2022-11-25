const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const Hist = require('../models/historyModel')

//TEMPORARY SECRET KEY
tempSecretKey = "boopoop"

// Handling signup request
router.post("/signup", async (req, res, next) => {
	let { name, email, password } = req.body;
    const user = new User({
        name: name,
        email: email,
        password: password,
    })
	console.log(req.body)
	try {
        const userExist = await User.exists({email: email});
        if (userExist) {
			const removedPost = await User.deleteOne({email: email})
		}
        const newUser = await user.save()
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
	let token;
	try {
		//Creating jwt token
		token = jwt.sign(
		{ email: email },
		tempSecretKey,
		{ expiresIn: "1h" }
		);
	} catch (err) {
		console.log(err);
		const error = new Error("Unable to create token.");
		return next(error);
	}
	res
		.status(200)
		.json({
		success: true,
		data: {
			email: email,
			token: token,
		},
		});
});

// Handling login request
router.post("/login", async (req, res, next) => {
	let { email, password } = req.body;
	try {
		const userExist = await User.exists({email: email, password: password});
		if (!userExist) {
			return res.status(401).json({message: "Email/Password is not correct"})
		}
	} catch (err) {
		return res.status(500).json({message: err})
	}
	let token;
	try {
		//Creating jwt token
		token = jwt.sign(
		{ email: email },
		tempSecretKey,
		{ expiresIn: "1h" }
		);
	} catch (err) {
		console.log(err);
		const error = new Error("Unable to create token.");
		return next(error);
	}
	res
		.status(200)
		.json({
		success: true,
		data: {
			email: email,
			token: token,
		},
		});
});

//retrieve a user's points for a specific game
router.get('/getGame', async (req, res) => {
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

//retrieve all history of one player's profile
router.get('/profile', async (req, res) => {
	//FOR TESTING
	//let {username} = req.body;
	//const user = await User.findOne({"name": username})
    
	try {
		let user = jwt.verify(req.headers['authorization'].split(' ')[1], "boopoop").email
        var allHistories = [];
        for (var i = 0; i < user.history.length; i++){
            //for each history document
            const hist = await Hist.findById(user.history[i])
            allHistories.push([hist.gameID, hist.points])
        }
        console.log(allHistories)
        res.json(allHistories)
        console.log("Successfully return all history of given user.")
    } catch (err) {
        console.log("Unable to display history.")
        res.status(500).json({message: err.message})
    }
})

module.exports = router
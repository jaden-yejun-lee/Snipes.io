const express = require('express')
const router = express.Router()
const User = require('../models/users')
const jwt = require('jsonwebtoken')


//TEMPORARY SECRET KEY
tempSecretKey = "boopoop"

// Handling post request
router.get("/", async (req, res, next) => {
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

module.exports = router
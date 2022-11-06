// Importing modules
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Some configuration
const app = express();
app.use(express.json());

//TEMPORARY SECRET KEY
tempSecretKey = "boopoop"

// Handling post request
app.post("/login", async (req, res, next) => {
let { email, password } = req.body;
//check if email/pass is in db
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

//Temporary for while not connected to database yet
app.listen(8080)
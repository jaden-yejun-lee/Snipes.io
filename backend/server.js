require('dotenv').config() //load all the config variables from env

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true})

//Checking the DB Connection 
const db = mongoose.connection
db.on('error', (error) => console.error(error)) //If there is an error log the error
db.once('open', () => (console.log('Connected to Database'))) //Once you can open/connect to Database, log that there was a connection

//Let the server accept JSON
// app.use(express.json())
app.use(bodyParser.json())

//Connecting the [backend]/sales route to go to /routers/sales.js
const salesRouter = require("./routes/sales")
app.use('/sales', salesRouter) //anything with /subscribers will go into subscribers Router
const gameRouter = require("./routes/gameRoute")
app.use('/gameModel', gameRouter)

app.listen(8080, () => console.log('Server Started'))
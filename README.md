# snipes.io
UCLA CS 35L Final Project

snipes.io is a client/server app for playing a team-based, IRL scavenger hunt game that runs as a general web application (but recommended to be run on a mobile device).  2 teams battle to get the most “snipes”. 

## How to run snipes.io on your machine
Have ```npm``` installed on your machine.

```cd``` into your desired directory, and follow the following steps:

## First clone the repo
```git clone https://github.com/GavinWon/snipes.io.git```

## Connect to the database
Create .env file in the backend/ directory

Set “DATABASE_URI” to mongoose link

Example env file and replace ‘username’ and ‘password’ with your credential
```DATABASE_URI = mongodb+srv://username:password@snipes-database.z4d4zdt.mongodb.net/demo```

## To start the frontend
Open a bash terminal.

```cd``` into the ```snipes.io/frontend/``` directory

Run ```npm install```

Run ```npm start```

## To start the backend
Open another bash terminal.

```cd``` into the ```snipes.io/backend/``` directory

Run ```npm install```

Run ```npm start```
	
Once the console says that the “Server Started” and “Connected to Database,” the game is ready to play. Navigate to http://localhost:3000/ to begin. Now, battle with your friends and see who can get the most snipes.

## Tech Stack
This project was created using the MERN tech stack (MongoDB, Express.js, React, Node.js)

## Acknowledgments
The UI was made possible by [Material UI](https://mui.com/).

## Team members
- [Edwin He](https://github.com/Edwinhe03)
- [Gavin Wong](https://github.com/GavinWon)
- [Ingrid Lee](https://github.com/ingriddleee)
- [Jaden Lee](https://github.com/jaden-yejun-lee)
- [Michael Peng](https://github.com/MichaelPeng123)

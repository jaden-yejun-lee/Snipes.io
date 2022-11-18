import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useParams, useOutlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Lobby() {
    const { lobbyID } = useParams();
    const { token } = useAuth();
    const [gameState, setGameState] = useState('teamSelect');
    const outlet = useOutlet();

    console.log(lobbyID);

    const getLobby = async () => {
        try {
            const response = await fetch('http://localhost:8080/lobby', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    lobbyID: lobbyID,
                })
            }).then(data => data.json());
            // Need: lobby DNE error code, no permission error code, success code
            // Set gameState: teamSelect, objectSelect, inProgress
            const state = response?.data?.gameState;
            setGameState(state);
        }
        catch (e) {
            console.log('Fetch lobby failed: ' + e);
        }
    };

    getLobby();

    // TODO: Lobby logic (@BACKEND)
    // If lobby does not exist, return lobby DNE error code. 
    // Frontend can diplay alert: Lobby not found.
    // Otherwise if gameState=="teamSelect", add user to lobby and return success code and current gameState ("teamSelect")
    // Frontend will display the TeamScreen
    // Otherwise, (in object select or game in progress) if user not in lobby, return no permissions error code. 
    // Frontend will redirect back to home screen. Maybe display alert: Game already started.
    // Otherwise, return success code and current gameState ("objectScreen" or "inProgress")
    // Frontend will display the proper screen

    return (
        <Container component="main" maxWidth="xs">
            { outlet || (gameState === 'teamSelect' ? <TeamSelectScreen lobbyID={lobbyID}></TeamSelectScreen> : <div>Hello</div>)}
            {/* gameState === 'objectSelect' ? <ObjectSelectScreen></ObjectSelectScreen> : <GameScreen></GameScreen> */}
        </Container>
    );
}

function TeamSelectScreen(props) {
    const { token } = useAuth();
    const [team1, setTeam1] = useState([]);
    const [team2, setTeam2] = useState([]);

    const updateTeams = async () => {
        try {
            const response = await fetch('http://localhost:8080/lobbyTeams', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    lobbyID: props.lobbyID,
                })
            }).then(data => data.json());
            setTeam1(response?.data?.team1);
            setTeam2(response?.data?.team2);
        }
        catch (e) {
            console.log('Update lobby failed: ' + e);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            updateTeams(token, props.lobbyID);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleStart = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/updateLobby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    lobbyID: props.lobbyID,
                    // TODO
                })
            }).then(data => data.json());
        } catch (e) {
            console.log('Start game failed: ' + e);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Lobby Code: {props.lobbyID}
                </Typography>
                <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={6}>
                        <Team name="Team 1" players={team1}></Team>
                    </Grid>
                    <Grid item xs={6}>
                        <Team name="Team 2" players={team2}></Team>
                    </Grid>
                </Grid>
                <Box component="form" onSubmit={handleStart} sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Start Game
                    </Button>
                </Box>
            </Box>
        </Container >
    );
}

function Team(props) {
    const { token } = useAuth();

    const handleJoin = async (event) => {
        event.preventDefault();
        console.log('Joined ' + props.name);
        try {
            const response = await fetch('http://localhost:8080/updateLobby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    lobbyID: props.lobbyID,
                    // TODO
                })
            }).then(data => data.json());
        } catch (e) {
            console.log('Join team failed: ' + e);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem style={{ textAlign: 'center' }}>
                <ListItemText primary={props.name + ':'} />
            </ListItem>
            <Divider />
            <List>
                {
                    props.players.map((item) =>
                        <ListItem key={item} style={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItem>)
                }
            </List>
            <Box component="form" onSubmit={handleJoin} sx={{ textAlign: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                >
                    Join {props.team}
                </Button>
            </Box>
        </Box>
    );
}

export default Lobby
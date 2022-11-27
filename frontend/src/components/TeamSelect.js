import React, { useState } from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert';

function TeamSelect(props) {
    const { token } = useAuth();
    const navigate = useNavigate()
    
    const [ alert, setAlert ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState("");

    const handleJoin = async (ID, event) => {
        event.preventDefault();
        console.log('Joining Team ' + ID);
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/gameModel/' + props.lobbyID + '/assignPlayer/' + ID, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(data => 
                {
                    statusCheck(data)
                    return data.json()
                })
        } catch (e) {
            console.log('Join team failed: ' + e);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/gameModel/' + props.lobbyID + '/state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    state: "target_select",
                })
            }).then(data => 
                {
                    statusCheck(data)
                    return data.json();
                })
        } catch (e) {
            console.log('Start target selection failed: ' + e);
        }
    };

    const handleLeave = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/gameModel/' + props.lobbyID + '/assignPlayer', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(data => {
                statusCheck(data)
                data.json()
                
            })
            navigate('/home');
        } catch (e) {
            console.log('Leave game failed: ' + e);
        }
    };

    const statusCheck = (data) => {
        if (data.status === 400) {
            setAlert(true);
            setAlertMessage("Error with the server. Please try again later");
            throw new Error("Error with the server.")
        } else if (data.status === 403) {
            setAlert(true);
            setAlertMessage("Current game is unavailable or finished already")
            throw new Error("Current game is unavailable or finished already")
        } else if (data.status === 404) {
            setAlert(true);
            setAlertMessage("Lobby game ID does not exist");
            throw new Error("Lobby Game ID does not exist")
        }
    }

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
                    Game ID: {props.lobbyID}
                </Typography>
                <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={6}>
                        <Team lobbyID={props.lobbyID} ID="1" players={props.team1} handleSubmit={handleJoin}></Team>
                    </Grid>
                    <Grid item xs={6}>
                        <Team lobbyID={props.lobbyID} ID="2" players={props.team2} handleSubmit={handleJoin}></Team>
                    </Grid>
                </Grid>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 5, mb: 2 }}
                    >
                        All ready!
                    </Button>
                </Box>
                <Box component="form" onSubmit={handleLeave} sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                    >
                        Leave Game
                    </Button>
                </Box>
                {alert ? <Alert severity='error' sx={{ mt: 1, textAlign: 'center' }} onClose={() => setAlert(false)}>{alertMessage}</Alert> : <></> }
            </Box>
        </Container >
    );
}

function Team(props) {
    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem style={{ textAlign: 'center' }}>
                <ListItemText primary={'Team ' + props.ID + ':'} />
            </ListItem>
            <Divider sx={{ ml: '5%', mr: '5%' }}/>
            <List>
                {
                    props.players.map((player) =>
                        <ListItem key={player} style={{ textAlign: 'center' }}>
                            <ListItemText primary={player} />
                        </ListItem>)
                }
            </List>
            <Box component="form" onSubmit={(event) => props.handleSubmit(props.ID, event)} sx={{ textAlign: 'center' }}>
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

export default TeamSelect;
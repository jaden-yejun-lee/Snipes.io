import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Alert from '@mui/material/Alert';

function Game(props) {
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [ alert, setAlert ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState("");

    const goto = (page, event) => {
        event.preventDefault();
        navigate(page);
    }

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
                    state: "game_over",
                })
            }).then(data => {
                statusCheck(data);
                data.json();
            });
        } catch (e) {
            console.log('Start game failed: ' + e);
        }
    };

    const statusCheck = (data) => {
        if (data.status === 401) {
            navigate('/login', {state: {from: location, alert: true}})
        } else if (data.status === 403) {
            setAlert(true);
            setAlertMessage("You are not in game. You cannot access this.");
            throw new Error("Unauthorized access or action");
        } else if (data.status === 404) {
            setAlert(true);
            setAlertMessage("Lobby game ID does not exist.");
            throw new Error("Lobby Game ID does not exist")
        } else if (data.status === 500) {
            setAlert(true);
            setAlertMessage("Error with the server. Please try again later.");
            throw new Error("Error with the server.")
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
                <Grid container sx={{ mt: 4, mb: 2 }}>
                    <Grid item xs={6}>
                        <Points points={props.points[0]} team="1" />
                    </Grid>
                    <Grid item xs={6}>
                        <Points points={props.points[1]} team="2" />
                    </Grid>
                </Grid>
                <TargetList targets={props.targets} />
                <Box component="form" onSubmit={(event) => goto('killFeed', event)} sx={{ mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Kill Feed
                    </Button>
                </Box>
                <Box component="form" onSubmit={(event) => goto('upload', event)} sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Upload Snipe
                    </Button>
                </Box>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                    >
                        End Game
                    </Button>
                </Box>
                {alert ? <Alert severity='error' sx={{ mt: 1, textAlign: 'center' }} onClose={() => setAlert(false)}>{alertMessage}</Alert> : <></> }
            </Box>
        </Container >
    );
}

function Points(props) {
    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem style={{ textAlign: 'center' }}>
                <ListItemText primary={'Team ' + props.team + ':'} />
            </ListItem>
            <Divider sx={{ ml: '5%', mr: '5%' }} />
            <ListItem style={{ textAlign: 'center' }}>
                <ListItemText primary={props.points + ' points'} />
            </ListItem>
        </Box>
    );
}

function TargetList(props) {
    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem style={{ textAlign: 'center' }}>
                <ListItemText primary={'Targets:'} />
            </ListItem>
            <Divider sx={{ ml: '30%', mr: '30%' }} />
            <List dense>
                {
                    props.targets.map((target, index) =>
                        <ListItem key={index} style={{ textAlign: 'center' }}>
                            <ListItemText primary={target} />
                        </ListItem>)
                }
            </List>
        </Box>
    );
}

export default Game;
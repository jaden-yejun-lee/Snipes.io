import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Leaderboard(props) {
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleLeave = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/gameModel/' + props.lobbyID + '/assignPlayer', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(data => data.json());
            navigate('/home');
        } catch (e) {
            console.log('Delete player failed: ' + e);
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
                    Lobby Code: {props.lobbyID}
                </Typography>
                <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography component="h6" variant="h6">
                                Game Over!
                            </Typography>
                            <Typography component="h6" variant="h6">
                                Final Leaderboard:
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Points points={props.leaderboard.filter((player) => player.team == '1')} team="1" />
                    </Grid>
                    <Grid item xs={6}>
                        <Points points={props.leaderboard.filter((player) => player.team == '2')} team="2" />
                    </Grid>
                </Grid>
                <Box component="form" onSubmit={handleLeave} sx={{ mt: 10 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                    >
                        Leave Game
                    </Button>
                </Box>
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
            <List dense>
                {
                    props.points.map((player, index) =>
                        <ListItem key={index} style={{ textAlign: 'center' }}>
                            <ListItemText primary={player.user + ': ' + player.points + ' points'} />
                        </ListItem>)
                }
            </List>
        </Box>
    );
}

export default Leaderboard;
import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

function Game(props) {
    const navigate = useNavigate();

    const goto = (page, event) => {
        event.preventDefault();
        navigate(page);
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
                <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={6}>
                        <Points points={props.points[0]} team="1" />
                    </Grid>
                    <Grid item xs={6}>
                    <Points points={props.points[1]} team="2" />
                    </Grid>
                </Grid>
                <Box component="form" onSubmit={(event) => goto('killFeed', event)} sx={{ mt: 10 }}>
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Kill Feed
                    </Button>
                </Box>
                <Box component="form" onSubmit={(event) => goto('upload', event)} sx={{ mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Upload Snipe
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
            <Divider sx={{ ml: '5%', mr: '5%' }}/>
            <ListItem style={{ textAlign: 'center' }}>
                <ListItemText primary={props.points} />
            </ListItem>
        </Box>
    );
}

export default Game;
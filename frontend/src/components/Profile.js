import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useAuth from '../hooks/useAuth';

function Profile() {
    const { token } = useAuth();
    const [user, setUser] = useState('test');
    const [history, setHistory] = useState([{ ID: 'abcde', score: 12345 }]);

    const getProfile = async () => {
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/userModel/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(data => data.json());
            console.log(response)
            setUser(response?.user);
            setHistory(response?.history);
        } catch (e) {
            console.log('Get profile failed: ' + e);
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

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
                <Typography component="h6" variant="h6" sx={{ mb: 4 }}>User: {user}</Typography>
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItem style={{ textAlign: 'center' }}>
                        <ListItemText primary={'Game History:'} />
                    </ListItem>
                    <Divider />
                    <List>
                        {
                            history.map((game, index) =>
                                <ListItem key={game.ID}>
                                    <ListItemText primary={(index+1) + '. ' + game.ID} />
                                    <ListItemText primary={game.score + ' points'} style={{ textAlign: 'right' }} />
                                </ListItem>)
                        }
                    </List>
                </Box>
            </Box>
        </Container>
    );
}

export default Profile
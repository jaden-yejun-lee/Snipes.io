import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';



function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [ alert, setAlert ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState("");

    const handleCreate = async (event) => {
        event.preventDefault();
        console.log('clicked create game');
        try {
            const response = await fetch('http://'+window.location.hostname+':8080/gameModel/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(data => {
                statusCheck(data)
                return data.json();
            });
            const lobbyID = response?.gameID;
            navigate('/lobby/'+lobbyID);
        } catch(e) {
            console.log('Create game failed: ' + e);
        }
    };

    const handleJoin = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const lobbyID = data.get('code')
        console.log('clicked join game with ' + lobbyID)
        navigate('/lobby/'+lobbyID);
    }

    const statusCheck = (data) => {
        if (data.status === 401) {
            navigate('/login', {state: {from: location, alert: true}})
        } else if (data.status === 500) {
            setAlert(true);
            setAlertMessage("Error with the Server. Please try again at another time");
            throw new Error("Error with the Server")
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
                <Box component="form" onSubmit={handleCreate} sx={{ mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create Game
                    </Button>
                </Box>
                <Box component="form" onSubmit={handleJoin} sx={{ mt: 8 }}>
                    <Stack spacing={2} alignItems="center">
                        <TextField
                            margin="normal"
                            required
                            id="code"
                            label="Code"
                            name="code"
                            sx={{ width: 3 / 4 }}
                            size="small"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Join Game
                        </Button>
                    </Stack>
                </Box>
                {/* Link should bring user to personal account page */}
                <Link href="login" variant="body2" sx={{ mt: 8 }}>
                    {"View Account"}
                </Link>
                {alert ? <Alert severity='error' onClose={() => setAlert(false)}>{alertMessage}</Alert> : <></> }
            </Box>
        </Container>
    );
}

export default Home
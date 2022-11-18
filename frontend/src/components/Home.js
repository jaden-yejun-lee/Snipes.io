import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const handleCreate = async (event) => {
        event.preventDefault();
        console.log('clicked create game');
        try {
            const response = await fetch('http://localhost:8080/createLobby', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(data => data.json());
            const lobbyID = response?.data?.lobbyID;
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
            </Box>
        </Container>
    );
}

export default Home
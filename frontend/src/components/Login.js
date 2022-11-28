import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";
    const { token, setToken } = useAuth();
    const [ alert, setAlert ] = useState(location.state?.alert || false);
    const [ alertMessage, setAlertMessage ] = useState(location.state?.alert ? "Login token has expired. Please log in again." : "");
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const user = data.get('username');
        const password = data.get('password');
        console.log({
            username: user,
            password: password,
        });
        try {
            const response = await fetch('http://'+window.location.hostname+':8080/userModel/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user,
                    password: password,
                })
            }).then(data => {
                statusCheck(data)
                return data.json()
            });
            console.log(response);
            
            const token = response?.data?.token;
            setToken(token);
            navigate(from, { replace: true });
        }
        catch (e) {
            console.log('Login failed: ' + e);
        }
    };

    const statusCheck = (data) => {
        if (data.status === 401) {
            setAlert(true);
            setAlertMessage("Incorrect Login Information");
            throw new Error("Incorrect Login Information");
        } else if (data.status === 500) {
            setAlert(true);
            setAlertMessage("Error with the Server. Please try again at another time");
            throw new Error("Error with the Server");
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
                    snipes.io
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, textAlign: 'center' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Log In
                    </Button>
                    {alert ? <Alert severity='error' onClose={() => setAlert(false)}>{alertMessage}</Alert> : <></> }
                    <Grid container>
                        <Grid item xs>
                            <Link href="register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Login
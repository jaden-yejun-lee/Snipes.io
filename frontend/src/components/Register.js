import React, { useState } from "react";
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Alert from '@mui/material/Alert';

function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";
    const { token, setToken } = useAuth();
    const [ alert, setAlert ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState("");

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
            const response = await fetch('http://'+window.location.hostname+':8080/userModel/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: user,
                    email: user,
                    password: password,
                })
            }).then(data =>  {
                statusCheck(data)
                return data.json()
            });
            const token = response?.data?.token;
            setToken(token);
            navigate(from, { replace: true });
        }
        catch (e) {
            console.log('Signup failed: ' + e);
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
                    mt: 8,
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Create an Account
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
                        id="password"
                        label="Password"
                        type="password"
                        name="password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    {alert ? <Alert severity='error' onClose={() => setAlert(false)}>{alertMessage}</Alert> : <></> }
                    <Grid container>
                        <Grid item xs>
                            <Link href="login" variant="body2">
                                {"Already have an account? Log in"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default Register
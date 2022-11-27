import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useAuth from '../hooks/useAuth';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

function TargetSelect(props) {
    const { token } = useAuth();
    const [ alert, setAlert ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState("");

    const handleAddTarget = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const target = data.get('target');
        console.log('Adding target ' + target);
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/gameModel/' + props.lobbyID + '/target', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    object: target,
                })
            }).then(data => {

                objectStatusCheck(data);
                data.json();
            })
                
                
        } catch (e) {
            console.log('Add target failed: ' + e);
        }
    };

    const handleDeleteTarget = async (target, event) => {
        event.preventDefault();
        console.log('Deleting target ' + target);
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/gameModel/' + props.lobbyID + '/target/' + target, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(data => {
                objectStatusCheck(data)
                data.json()});
        } catch (e) {
            console.log('Delete target failed: ' + e);
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
                    state: "in_progress",
                })
            }).then(data => {
                gameStatusCheck(data);
                data.json()});
        } catch (e) {
            console.log('Start game failed: ' + e);
        }
    };

    const objectStatusCheck = (data) => {
        if (data.status === 400) {
            setAlert(true);
            setAlertMessage("Error with adding/deleting target object. Please try again. ");
            throw new Error("Error with adding/deleting target object");
        }
        if (data.status === 404) {
            setAlert(true);
            setAlertMessage("Lobby game ID does not exist");
            throw new Error("Lobby Game ID does not exist")
        } else if (data.status === 500) {
            setAlert(true);
            setAlertMessage("Error with the server. Please try again later");
            throw new Error("Error with the server.")
        }
    }

    const gameStatusCheck = (data) => {
        if (data.status === 400) {
            setAlert(true);
            setAlertMessage("There is no objects. Game cannot be started");
            throw new Error("There is no objects. Game cannot be started");
        } else if (data.status === 403) {
            setAlert(true);
            setAlertMessage("Unauthorized access or action");
            throw new Error("Unauthorized access or action");
        } else if (data.status === 404) {
            setAlert(true);
            setAlertMessage("Lobby game ID does not exist");
            throw new Error("Lobby Game ID does not exist")
        } else if (data.status === 500) {
            setAlert(true);
            setAlertMessage("Error with the server. Please try again later");
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
                <TargetList lobbyID={props.lobbyID} targets={props.targets} handleAdd={handleAddTarget} handleDelete={handleDeleteTarget}></TargetList>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 4, mb: 2 }}
                    >
                        Start Game!
                    </Button>
                </Box>
                {alert ? <Alert severity='error' sx={{ mt: 1, textAlign: 'center' }} onClose={() => setAlert(false)}>{alertMessage}</Alert> : <></> }
            </Box>
        </Container >
    );
}

function TargetList(props) {
    const [formTarget, setFormTarget] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormTarget('');
        props.handleAdd(event);
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem style={{ textAlign: 'center' }}>
                <ListItemText primary={'Target selection:'} />
            </ListItem>
            <Divider />
            <List dense>
                {
                    props.targets.map((target, index) =>
                        <ListItem key={index}
                            secondaryAction={
                                <IconButton edge="end" onClick={(event) => props.handleDelete(target, event)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={target} />
                        </ListItem>)
                }
            </List>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Stack spacing={2} alignItems="center">
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="target"
                        label="Target"
                        name="target"
                        sx={{ width: 1 / 2 }}
                        size="small"
                        onChange={(event) => setFormTarget(event.target.value)}
                        value={formTarget}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Target
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}

export default TargetSelect;
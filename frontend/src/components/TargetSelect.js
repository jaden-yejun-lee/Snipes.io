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

function TargetSelect(props) {
    const { token } = useAuth();

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
            }).then(data => data.json());
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
            }).then(data => data.json());
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
            }).then(data => data.json());
        } catch (e) {
            console.log('Start game failed: ' + e);
        }
    };

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
                <TargetList lobbyID={props.lobbyID} targets={props.targets} handleAdd={handleAddTarget} handleDelete={handleDeleteTarget}></TargetList>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 8, mb: 2 }}
                    >
                        Start Game!
                    </Button>
                </Box>
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
                <ListItemText primary={'Targets:'} />
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
import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useParams } from 'react-router-dom';

function Lobby() {
    const { lobbyID } = useParams()
    console.log(lobbyID)

    // If it does, get all relevant information for display
    // If not, go back to home screen? Maybe diplay alert: Lobby not found!

    // TODO: Event Handlers
    // Join Team 1, Join Team 2, Enter Object Selection

    // TODO: Rendering
    // Display lobby code at top
    // Display Grid with 2 Stacks that list Team 1 and Team 2, followed by names, followed by Join Team button  
    // Object Selection button
    return (
        <div>Hello</div>
    );
}

export default Lobby
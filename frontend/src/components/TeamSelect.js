import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useAuth from '../hooks/useAuth';

function TeamSelect(props) {
    const { token } = useAuth();

    const handleJoin = async (ID, event) => {
        event.preventDefault();
        console.log('Joining Team ' + ID);
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/gameModel/' + props.lobbyID + '/team/' + ID, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(data => data.json());
        } catch (e) {
            console.log('Join team failed: ' + e);
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
                    state: "objectSelect",
                })
            }).then(data => data.json());
        } catch (e) {
            console.log('Start target selection failed: ' + e);
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
                <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={6}>
                        <Team lobbyID={props.lobbyID} ID="1" players={props.team1} handleSubmit={handleJoin}></Team>
                    </Grid>
                    <Grid item xs={6}>
                        <Team lobbyID={props.lobbyID} ID="2" players={props.team2} handleSubmit={handleJoin}></Team>
                    </Grid>
                </Grid>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        All ready!
                    </Button>
                </Box>
            </Box>
        </Container >
    );
}

function Team(props) {
    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem style={{ textAlign: 'center' }}>
                <ListItemText primary={'Team ' + props.ID + ':'} />
            </ListItem>
            <Divider />
            <List>
                {
                    props.players.map((player) =>
                        <ListItem key={player} style={{ textAlign: 'center' }}>
                            <ListItemText primary={player} />
                        </ListItem>)
                }
            </List>
            <Box component="form" onSubmit={(event) => props.handleSubmit(props.ID, event)} sx={{ textAlign: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                >
                    Join {props.team}
                </Button>
            </Box>
        </Box>
    );
}

export default TeamSelect;
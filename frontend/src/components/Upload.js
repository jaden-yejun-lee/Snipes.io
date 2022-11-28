import React, { useState } from "react";
import { useOutletContext } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CssBaseline from '@mui/material/CssBaseline';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useAuth from '../hooks/useAuth';
import { Stack } from "@mui/system";
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';


//https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/
//URL.createObjectURL: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
function Upload() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();
    const [lobbyID, , targets] = useOutletContext();
    const [selectedPhoto, setSelectedPhoto] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState('');
    const [ alert, setAlert ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState("");
    const [ success, setSuccess ] = useState(false);


    const fileSelectedHandler = (event) => {
        setSelectedPhoto(event.target.files[0]);
        setIsSelected(true);
    }

    const handleTargetSelect = (event) => {
        setSelectedTarget(event.target.value);
    }

    const handleFileUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', selectedPhoto);
        formData.append('object', selectedTarget);
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/gameModel/' + lobbyID + '/photos', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData,
            }).then(data => {
                statusCheck(data)
                data.json()
            });
            setSelectedPhoto();
            setIsSelected(false);
            setSelectedTarget('')
        } catch (e) {
            console.log('Upload photo failed: ' + e)
        }
    }

    const statusCheck = (data) => {
        if (data.status === 200) {
            setSuccess(true);
            setAlert(false);
            setAlertMessage("No photo selected. Please try again.");
            throw new Error("No photo selected");
        } else if (data.status === 400) {
            setSuccess(false);
            setAlert(true);
            setAlertMessage("No photo selected. Please try again.");
            throw new Error("No photo selected");
        } else if (data.status === 401) {
            navigate('/login', {state: {from: location, alert: true}})
        } else if (data.status === 404) {
            setSuccess(false);
            setAlert(true);
            setAlertMessage("Lobby game ID does not exist.");
            throw new Error("Lobby Game ID does not exist")
        } else if (data.status === 500) {
            setAlert(true);
            setAlertMessage("Error with the Server. Please try again at another time.");
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
                    Game ID: {lobbyID}
                </Typography>
                <Box component="form" onSubmit={handleFileUpload} sx={{ mt: 4, textAlign: 'center' }}>
                    {isSelected ? (
                        <Typography component="h5" variant="subtitle1">
                            Selected Photo:
                        </Typography>
                    ) : (
                        <></>
                    )}
                    {isSelected ? (
                        <img src={URL.createObjectURL(selectedPhoto)} width='400px' />
                    ) : (
                        <Typography component="h5" variant="subtitle1">
                            Please select a photo:
                        </Typography>
                    )}
                    <Stack spacing={4} alignItems="center">
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                            sx={{ textAlign: "center" }}
                        >
                            {isSelected ? (
                                ("Select New Photo")
                            ) : (
                                ("Select Photo")
                            )}
                            <input type="file" hidden onChange={fileSelectedHandler} onClick={(event) => event.target.value = null} />
                        </Button>
                        <FormControl
                            variant="standard"
                            sx={{ minWidth: 120 }}
                            size="small"
                            required
                        >
                            <InputLabel>Target Name</InputLabel>
                            <Select
                                value={selectedTarget}
                                label="Target"
                                onChange={handleTargetSelect}
                                sx={{ alignItems: 'center' }}
                            >
                                {
                                    targets.map((target) =>
                                        <MenuItem key={target} value={target}>{target}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Upload
                        </Button>
                        {alert ? <Alert severity='error' onClose={() => setAlert(false)}>{alertMessage}</Alert> : <></> }
                        {success ? <Alert severity='success' onClose={() => setSuccess(false)}>Photo successfuly uploaded</Alert> : <></> }
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
}

export default Upload
import React from "react";
import { useState } from "react";
import Container from '@mui/material/Container';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CssBaseline from '@mui/material/CssBaseline';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


//https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/
//URL.createObjectURL: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
function Upload(props) {

    const [selectedPhoto, setSelectedPhoto] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [selectedObject, setSelectedObject] = useState("");
    const objects = ["Tree", "Trash Can", "Pole"] // const objects = props.objects;

    let menuItemList = objects.map((object) => {
        return <MenuItem key={object} value={object}>{object}</MenuItem> //Might need to do object.name depending on how objects is provided
    })

    const fileSelectedHandler = (event) => {
        setSelectedPhoto(URL.createObjectURL(event.target.files[0]));
        setIsSelected(true);

    }
    const handleFileUpload = () => {
        console.log("file uploaded");
    }

    const handleObjectSelect = (event) => {
        setSelectedObject(event.target.value);
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
                {isSelected ? (
                    <img src={selectedPhoto} width='400px' margin='1'/>
                ) : (
                    <p>Please select a photo</p>
                )} 
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    sx={{ m: 2, textAlign: "center" }}
                >
                    {isSelected ? (
                        ("Select a New Photo")
                    ): (
                        ("Select Photo")
                    )}
                    <input type="file" hidden onChange={fileSelectedHandler} />
                </Button>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120}} size="small">
                    <InputLabel id="demo-simple-select--standard-small">Object Name</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-small"
                        id="demo-simple-select-standard"
                        value={selectedObject}
                        label="Object"
                        onChange={handleObjectSelect}
                        sx={{alignItems: 'center'}}
                    >
                        {menuItemList}
                    </Select>
                </FormControl>
                <Button
                    component="label"
                    variant="contained"
                    onClick={handleFileUpload}
                    sx={{ m: 1 }}
                >
                    Upload
                    <input type="file" hidden onChange={handleFileUpload} />
                </Button>
            </Box>
        </Container>
    );
}

export default Upload
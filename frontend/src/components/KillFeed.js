import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Buffer } from 'buffer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';

function KillFeed() {
    const [lobbyID, photos] = useOutletContext();
    const [images, setImages] = useState([]);

    const formatImages = () => {
        const imgs = [];
        for (let i in photos) {
            imgs.push({
                image: Buffer.from(photos[i].image.data).toString('base64'),
                username: photos[i].username,
                timestamp: new Date(photos[i].timestamp).toLocaleTimeString('en-US'),
                target: photos[i].target,
            });
        }
        setImages(imgs);
    }

    useEffect(() => {
        formatImages();
    }, [photos]);
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
                <ImageList cols={1} sx={{ mt: 4, width: 3 / 4 }}>
                    {images.map((img) => (
                        <ImageListItem key={img.timestamp} sx={{mb: 2}}>
                            <img
                                src={`data:image/png;base64,${img.image}`}
                                loading="lazy"
                                style={{ width: '100%' }}
                            />
                            <ImageListItemBar
                                subtitle={img.timestamp + ': ' + img.username + ' sniped ' + img.target}
                                position="below"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Container >
    );
}

export default KillFeed
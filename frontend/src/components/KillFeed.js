import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Buffer } from 'buffer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

function KillFeed() {
    const [photoData, setPhotoData] = useOutletContext();
    const [images, setImages] = useState([]);

    const getImage = async (ID) => {
        try {
            const response = await fetch('http://' + window.location.hostname + ':8080/upload/' + ID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(data => data.json());
            const buf = response?.image?.data;
            return Buffer.from(buf.data).toString('base64');
        } catch (e) {
            console.log('Get image ' + ID + ' failed: ' + e);
            return null;
        }
    }

    const getImages = async () => {
        const imgs = [];
        for (let i in photoData) {
            imgs.push({
                img: await getImage(photoData[i].ID),
                username: photoData[i].username,
                target: photoData[i].target,
                timestamp: photoData[i].timestamp,
            });
        }
        setImages(imgs);
    }

    useEffect(() => {
        getImages();
    }, []);
    
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <ImageList cols={1} sx={{ width: 3 / 4 }}>
                    {images.map((img) => (
                        <ImageListItem key={img.timestamp} sx={{mb: 2}}>
                            <img
                                src={`data:image/png;base64,${img.img}`}
                                loading="lazy"
                                style={{ width: '100%' }}
                            />
                            <ImageListItemBar
                                subtitle={img.timestamp + ': ' + img.username + ' (' + img.target + ')'}
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
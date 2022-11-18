import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function KillFeed() {
    const [photoIDs, setPhotoIDs] = useOutletContext();
    const [images, setImages] = useState(['iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==', 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==']);

    const getImage = async (ID) => {
        try {
            const response = await fetch('http://'+window.location.hostname+':8080/upload/' + ID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(data => data.json());
            const buf = response?.image?.data;
            return Buffer.from(buf.data).toString('base64');
        } catch (e) {
            console.log('Get image ' + ID + ' failed: ' + e);
            return null
        }
    }

    const getImages = async () => {
        const imgs = [];
        for (let i in photoIDs) {
            imgs.push(await getImage(photoIDs[i]));
        }
        setImages(imgs);
    }

    useEffect(() => {
        //getImages();
    }, [photoIDs]);

    return (
        <div>
            <img src={`data:image/png;base64,${images[0]}`} width='1080px' />
        </div>
    );
}

export default KillFeed
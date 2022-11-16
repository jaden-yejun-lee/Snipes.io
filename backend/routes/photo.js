const express = require('express')
const router = express.Router()
const Photo = require('../models/photo')
const multer = require('multer')
const fs = require('fs')

// stores photos on local device
const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});

// uploading files on mongodb
const upload = multer({
    storage: Storage
}).single('testImage')  // this parameter has to match postman key which should be "testImage" and then select file for value

// post a photo to db 
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            console.log(err)
        }
        else {
            const newPhoto = new Photo({
                name: req.body.name,
                image: {
                    data: fs.readFileSync('./uploads/' + req.file.filename), // read in file from uploads folder (which gets automatically created)
                    contentType: 'image/png'
                }
            })

            newPhoto.save()
            .then(() => res.send('successfully uploaded'))
            .catch((err) => console.log(err));
        }
    }) 
})

//GET: Get a photo with id
router.get('/:id', async (req, res) => {
    const post = await Photo.findById(req.params.id);
    res.json(post)
})

//DELETE: Deleting a photo with id
router.delete('/:id', async (req, res) => {
    try {
        const removedPost = await Photo.deleteOne({id: req.params.id})
        res.json(removedPost)
        console.log("successfully deleted")
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//GET: Get all the sales
router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find()
        res.json(photos)
        console.log("Get request success")
    } catch (err) {
        console.log("Something went wrong!")
        res.status(500).json({message: err.message})
    }
})


module.exports = router
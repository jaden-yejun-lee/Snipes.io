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
}).single('image')  // this parameter has to match postman key which should be "image" and then select file for value



// post a photo to db 
router.post('/:gameID/photos', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            console.log(err)
        }
        else {

            const newPhoto = new Photo({
                object: req.body.object,
                image: {
                    data: fs.readFileSync('./uploads/' + req.file.filename), // read in file from uploads folder (which gets automatically created)
                    contentType: 'image/png'
                },
                // FIGURE OUT USERS HEADER STUFF
                user: jwt.verify(req.headers['authorization'].split(' ')[1], "boopoop").email,
                timestamp: Date.now()
            })

            newPhoto.save()
            .then(() => res.send('successfully uploaded'))
            .catch((err) => console.log(err));

            // deletes file from local so that unnecessary space is not used in holding pictures in upload folder
            fs.unlink('./uploads/' + req.file.filename, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
          
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

//GET: Get all the photos
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
const express = require('express')
const router = express.Router()
const Photo = require('../models/photo')
const multer = require('multer')

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({
    storage: Storage
}).single('testImage')

router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            console.log(err)
        }
        else {
            const newPhoto = new Photo({
                name: req.body.name,
                image: {
                    data: req.file.filename,
                    contentType: 'image/png'
                }
            })

            newPhoto.save()
            .then(() => res.send('successfully uploaded'))
            .catch((err) => console.log(err));
        }
    })
})


module.exports = router
//This route handles the uploading of files to the database
const express = require('express');
const router = express.Router();
//returns a collection of files
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Upload fetched"
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "Upload posted"
    });
});

//handling requests for individual file uploads and retrievals

router.get('/:uploadId', (req, res, next)=>{
    res.status(200).json({
        message: "upload details",
        uploadId: req.params.uploadId
    });
});

router.delete('/:uploadId', (req, res, next)=>{
    res.status(200).json({
        message: "upload deleted",
        uploadId: req.params.uploadId
    });
});

module.exports = router;
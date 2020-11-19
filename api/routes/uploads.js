//This route handles the uploading of files to the database
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Upload = require('../models/uploads');
const User = require('../models/users');
//returns a collection of files
router.get('/', (req, res, next) => {
    //add other fields to select clause later on
    Upload.find().select('user _id').populate('user', 'name').exec().then(docs => {
        res.status(200).json({
            count: docs.length,
            uploads: docs.map(doc =>{
                //add filename and filetype later
                return {
                    _id: doc._id,
                    user: doc.user,
                    //filename: doc.fileName
                    //filetype: doc.fileType
                    request: {
                        type: 'GET',
                        url: req.protocol + "://" + req.get(host) + req.originalUrl
                    }
                }
            })
            
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    User.findById(req.body.userId).then(user => {
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        const upload = new Upload({
            _id: mongoose.Types.ObjectId,
            //fileName: filename,
            //fileType: filetype
        });
        return upload.save()
    
    }).then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Upload saved",
            createdUpload: {
                _id: result._id,
                user: result.user
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000'
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
   
    //call getfiletype function and getfilename function, store name + type in const variables. Perform an if else function to determine filetype based on the extension
    //const filename = getfilename(file)
    //const filetype = getfiletype(file)
});
 
//handling requests for individual file uploads and retrievals

router.get('/:uploadId', (req, res, next)=>{
    Upload.findById(req.params.uploadId).populate('user').exec().then(upload => {
        if(!order){
            return res.status(404).json({
                message: "Upload not found"
            });
        }
        res.status(200).json({
            upload: upload,
            request: {
                type: 'GET',
                url: req.protocol + "://" + req.get(host) + "/uploads"//Should display all uploads, if not hardcode this in
            }
        });
    }).catch(err => {
        res.status(500).json({
            message: "File not found",
            error: err
        });
    });
    
});

router.delete('/:uploadId', (req, res, next)=>{
    Upload.remove({_id: req.params.uploadId}).exec().then(result => {
        res.status(200).json({
            message: "Upload deleted!",
            upload: upload,
        });
    }).catch(err => {
        res.status(500).json({
            message: "Could not find file",
            error: err
        });
    });
});

module.exports = router;
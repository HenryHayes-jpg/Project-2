//This route handles the uploading of files to the database
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fileUpload = multer({dest: 'fileuploads/'});

const Upload = require('../models/uploads');
const User = require('../models/users');
//returns a collection of files

//******************************************************************************** */
//functions
function getExtension(str){
    return str.split('.')[1];
}

function getType(ext){
    type = "";
    object = {};//Use this object once I actually filter through data
    if(ext === "xlsx" || ext === "xlsm"){
        type = "Excell File";
    }else if(ext === "pdf"){
        type = "PDF file";
    }else if(ext === "txt"){
        type = "Raw Text file";
    }else{
        type = ext + " file";
    }
    return type;
}

//******************************************************************************** */
router.get('/', (req, res, next) => {
    //add other fields to select clause later on
    Upload.find().select('_id file').populate('user', 'name').exec().then(docs => {
        res.status(200).json({
            count: docs.length,
            uploads: docs.map(doc =>{
                //add filename and filetype later
                return {
                    _id: doc._id,
                    //user: doc.user,
                    file: doc.file,
                    //filetype: doc.fileType
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/uploads/' + doc._id
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

router.post("/", fileUpload.single('file'), async (req, res, next) => {
    //name = req.file.filename;
    //type = getType(getExtension(name));
    const upload = new Upload({
      _id: new mongoose.Types.ObjectId(),
      file: req.file.path,
      //fileName: name,
      //fileType: req.file.mimetype,
    });
    upload
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Uploaded file succesfully",
          createdUpload: {
              //name: name,
              _id: result._id,
              file: req.file.path,
              request: {
                  type: 'GET',
                  url: "http://localhost:3000/uploads/" + result._id
              }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
    //call getfiletype function and getfilename function, store name + type in const variables. Perform an if else function to determine filetype based on the extension
    //const filename = getfilename(file)
    //const filetype = getfiletype(file)
 
//handling requests for individual file uploads and retrievals

router.get('/:uploadId', (req, res, next)=>{
    Upload.findById(req.params.uploadId).exec().then(upload => {
        /*if(!order){
            return res.status(404).json({
                message: "Upload not found"
            });
        }*/
        res.status(200).json({
            upload: upload,
            request: {
                type: 'GET',
                url: "http://localhost:3000/uploads" //Should display all uploads, if not hardcode this in
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
            upload: result,
        });
    }).catch(err => {
        res.status(500).json({
            message: "Could not find file",
            error: err
        });
    });
});

module.exports = router;
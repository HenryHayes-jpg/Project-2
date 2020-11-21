//This route handles the uploading of files to the database
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

//returns a collection of files
const Upload = require('../models/uploads');
const User = require('../models/users');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './fileuploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const fileUpload = multer({storage: storage});


//******************************************************************************** */
//functions


//******************************************************************************** */
router.get('/', (req, res, next) => {
    //add other fields to select clause later on
    Upload.find().select('_id file fileName').populate('user', 'name').exec().then(docs => {
        res.status(200).json({
            count: docs.length,
            uploads: docs.map(doc =>{
                //add filename and filetype later
                return {
                    _id: doc._id,
                    file: doc.file,
                    filename: doc.fileName,
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
function getFileType(str){
    ext = str.split('.').pop();
    if(ext === "txt") {
        return "Text file";
    }else if(ext === "docx"){
        return "Word document";
    }else if(ext === "xlxs" || ext === "xlsm"){
        return "Excell document";
    }else if(ext === "pdf"){
        return "PDF document"
    }else{
        return ext + "file";
    }   
}
router.post("/", fileUpload.single('file'), async (req, res, next) => {
    type = getFileType(req.file.originalname)
    const upload = new Upload({
      _id: new mongoose.Types.ObjectId(),
      file: req.file.path,
      fileName: req.file.originalname,
      fileType: type
    });
    upload
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Uploaded file succesfully",
          createdUpload: {
              name: result.fileName,
              type: result.fileType, 
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
    Upload.findById(req.params.uploadId).select('_id fileName file').exec().then(upload => {
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
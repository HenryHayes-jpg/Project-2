//since mongoose works with schemas and models, we must define how an upload record is going to look in our db
const mongoose = require('mongoose');

//a json notation for how a upload object will look
const uploadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    file: {type: String, required: true},
   // fileName: {type: String, required: true},
    //fileType: {type: String, required: true},
});

module.exports = mongoose.model('Upload', uploadSchema);

//since mongoose works with schemas and models, we must define how a user record is going to look in our db
const mongoose = require('mongoose');

//a json notation for how a user object will look
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required : true}
});

module.exports = mongoose.model('User', userSchema);

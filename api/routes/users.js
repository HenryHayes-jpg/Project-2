//This route will handle user signups, logins and maintenance
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/users');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling get request for users"
    });
});

router.post('/', (req, res, next) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        username: req.body.name
    });
    user.save().then(result => {
        console.log(result);
    }).catch(err => console.log(err));

    res.status(201).json({
        message: "Handling post request for users",
        createdUser: user
    });
});

router.get('/:userId', (req, res, next)=>{
    const id = req.params.userId;
    User.findById(id).exec().then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

});

router.patch('/:userId', (req, res, next)=>{
    res.status(200).json({
        message: "Update completed!"
    });
  
});

router.delete('/:userId', (req, res, next)=>{
    res.status(200).json({
        message: "Delete completed!"
    });
  
});

module.exports = router;

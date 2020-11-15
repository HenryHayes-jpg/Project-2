//This route will handle user signups, logins and maintenance
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/users');
//IF no parameters are passed to the mongoose find function, it will return all records
router.get('/', (req, res, next) => {
    User.find().exec().then(docs =>{
        console.log(docs);
        if(docs.length >= 0){
            res.status(200).json(docs);
        }else{
            res.status(404).json({
                message: 'There are no entries in the database'
            });
        }
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        username: req.body.name
    });
    user.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Handling POST requests to users",
            createdUser: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});
//fetches a specific user
router.get('/:userId', (req, res, next)=>{
    const id = req.params.userId;
    User.findById(id).exec().then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message: "This is not a valid ID"});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

});
//updates the record with a corresponding id value
router.patch('/:userId', (req, res, next)=>{
    const id = req.params.userId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id: id}, {$set: updateOps}).exec().then(result =>{
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        }); 
    });
});

router.delete('/:userId', (req, res, next)=>{
    const id = req.params.userId;
    User.remove({_id: id}).exec().then(result => {
        res.status(200).json(result);
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;

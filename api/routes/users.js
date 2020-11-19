//This route will handle user signups, logins and maintenance
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/users');
//IF no parameters are passed to the mongoose find function, it will return all records
router.get('/', (req, res, next) => {
    User.find().select('username _id').exec().then(docs =>{
        const response = {
            count: docs.length,
            users: docs.map(doc=>{
                return {
                    name: doc.username,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/users/" + doc._id  
                    }//hardcode the url domain once project has been hosted
                }
            })
        };
        res.status(200).json(response);
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
            message: "Created new user entry",
            createdUser: {
                name: result.username,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + result._id
                }
            }
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
    User.findById(id).select('username _id').exec().then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all usernames and IDs',
                    url: 'http://localhost:3000/users'
                }
            });
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
        res.status(200).json({
            message: 'User updated',
            request: {
                type: 'GET',
                url: 'http://localhost3000/users/' + id
            }
        });
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
        res.status(200).json({
            message: 'User removed',
            request: {
                type: "POST",
                url: "http://localhost:3000/users",
                body: {username: 'String'}
            }
        });
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;

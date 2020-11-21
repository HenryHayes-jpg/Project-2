//This route will handle user signups, logins and maintenance
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');

const User = require('../models/users');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}).exec().then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: "This e-mail is already assigned to a user"
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        username: req.body.username //encrypts the password. With salting routes
                    });
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User created!"
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
          
        }
    });
    
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email}).exec().then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message: 'E-mail is unauthorized or does not exist'
            });        
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: 'E-mail is unauthorized or does not exist'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: "Authorization successful!",
                    token: token
                });
            }
            res.status(401).json({
                message: 'E-mail is unauthorized or does not exist'
            });
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
                type: "GET",
                url: "http://localhost:3000/users",
            }
        });
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/', (req, res, next) => {
    User.find().select('username _id email').exec().then(docs =>{
        const response = {
            count: docs.length,
            users: docs.map(doc=>{
                return {
                    username: doc.username,
                    _id: doc._id,
                    email: doc.email,
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

router.get('/:userId', (req, res, next)=>{
    const id = req.params.userId;
    User.findById(id).select('username _id email').exec().then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                user: doc,
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

module.exports = router;

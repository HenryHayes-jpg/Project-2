//This route will handle user signups, logins and maintenance
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling get request for users"
    });
});

router.post('/', (req, res, next) => {
    const user = {
        name: req.body.name,
        userId: req.body.userId
    };
    res.status(201).json({
        message: "Handling post request for users",
        createdUser: user
    });
});

router.get('/:userId', (req, res, next)=>{
    const id = req.params.userId;
    if(id==='special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    }else{
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
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

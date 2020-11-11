//This route will handle user signups, logins and maintenance
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling get request for users"
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling post request for users"
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

module.exports = router;

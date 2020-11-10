const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.status(200).json({
        message: 'Lekker!'
    });
});
//This response tells us the app is working. We respond with a JSON object that has a message property of lekker
module.exports = app;
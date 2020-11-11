const express = require('express');
const app = express();
const morgan = require('morgan');//package for viewing logging information

const userRoutes = require('./api/routes/users');
const uploadRoutes = require('./api/routes/uploads');

app.use(morgan('dev'));//collects logging info from server
app.use('/users', userRoutes);
app.use('/uploads', uploadRoutes);

//setup of error handling for when none of the above routes are followed
app.use((req, res, next) => {
    const err = new Error('The requested page could not be found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;
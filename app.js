const express = require('express');
const app = express();
const morgan = require('morgan');//package for viewing logging information
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const uploadRoutes = require('./api/routes/uploads');

//using mongoose to connect to my mongoDB
mongoose.connect('mongodb+srv://Henry:' + process.env.MONGO_ATLAS_PW + '@cluster0.vnce9.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(morgan('dev'));//collects logging info from server
app.use('/fileuploads', express.static('fileuploads'));//makes fileuploads folder public
app.use(bodyParser.urlencoded({extended: false}));//parses url data
app.use(bodyParser.json());//parses json data

//setting up CORS policy
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Origin-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Origin-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

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
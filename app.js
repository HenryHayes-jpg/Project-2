const express = require('express');
const app = express();
const userRoutes = require('./api/routes/users');
const uploadRoutes = require('./api/routes/uploads');

app.use('/users', userRoutes);
app.use('/uploads', uploadRoutes);

module.exports = app;
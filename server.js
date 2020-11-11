const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;//This port will be assigned once the project is hosted online
const server = http.createServer(app);
server.listen(port);

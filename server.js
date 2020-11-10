const http = require('http');
const port = process.env.PORT || 3000;//This port will be assigned once the project is hosted online
const server = http.createServer();
server.listen(port);
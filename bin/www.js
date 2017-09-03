// This will be application entry. Setting up server
const http = require('http');
const app = require('../app'); 

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log("Server listening at " + port);
});
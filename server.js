const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.send('Welcome to the server!');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        // You can add code here to respond to the incoming message
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});


app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

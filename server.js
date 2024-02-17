const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array to store logged-in usernames
let users = [];

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.send('Welcome to the server!');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        print(typeof message)
        if (message.startsWith('/login')) {
            const username = message.split(' ')[1];
            users.push(username);
            console.log('Logged in:', username);
        }
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });


    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});

// Endpoint to retrieve logged-in users
app.get('/users', (req, res) => {
    res.json(users);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
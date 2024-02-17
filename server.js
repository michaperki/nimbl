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

        str = message.toString();
        test = message.body()
        console.log("test: ", test)
        console.log("str: ", str)

        // Check if the message is a username
        if (str.startsWith('/login')) {
            const username = str.substring(7).trim(); // Remove '/login ' from the message
            users.push(username);
            console.log(`${username} logged in`);
            ws.send(`Welcome, ${username}!`);
        }
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

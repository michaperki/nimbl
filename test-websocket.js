const WebSocket = require('ws');

// WebSocket server URL
const wsServerUrl = 'ws://localhost:3000';

// Create a WebSocket connection
const ws = new WebSocket(wsServerUrl);

// Event listener for when the connection is established
ws.on('open', function open() {
    console.log('Connected to WebSocket server');

    // Send a login message to the server
    ws.send('/login JohnDoe');
});

// Event listener for incoming messages
ws.on('message', function incoming(message) {
    // Decode the received message from buffer to string
    const decodedMessage = Buffer.from(message).toString('utf-8');
    console.log('Received message from server:', decodedMessage);
});

// Event listener for errors
ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
});

// Event listener for when the connection is closed
ws.on('close', function close() {
    console.log('WebSocket connection closed');
});

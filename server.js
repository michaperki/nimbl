const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array to store logged-in usernames
let users = [];
// Array to store active games
let games = [];

// Function to generate random 4-letter combination
function generateGameId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.send('Welcome to the server!');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        const str = message.toString();

        // Check if the message is a username
        if (str.startsWith('/login')) {
            const username = str.substring(7).trim(); // Remove '/login ' from the message
            users.push(username);
            console.log(`${username} logged in`);
            ws.send(`Welcome, ${username}!`);
        } else if (str.startsWith('/create-game')) {
            const playerId = str.substring(12).trim(); // Remove '/create-game ' from the message
            const gameId = generateGameId(); // Generate a random 4-letter game ID
            const game = { id: gameId, players: [playerId] };
            games.push(game);
            console.log(`Game "${gameId}" created by player "${playerId}"`);
            ws.send(`Game "${gameId}" created`);
        } else if (str.startsWith('/get-game')) {
            const gameId = str.substring(10).trim(); // Remove '/get-game ' from the message
            const game = games.find(g => g.id === gameId);
            if (game) {
                const gameData = `GameData: ${gameId}, ${game.players.join(', ')}`;
                ws.send(gameData);
            } else {
                ws.send(`Game "${gameId}" not found`);
            }
        } else if (str.startsWith('/join-game')) {
            console.log('Joining game')
            const [_, gameId, playerId] = str.split(' '); // Split the message to extract gameId and playerId
            console.log(gameId, playerId)
            const game = games.find(g => g.id === gameId);
            if (game) {
                game.players.push(playerId);
                console.log(`Player "${playerId}" joined game "${gameId}"`);
                // Broadcast the update to all players in the game
                games.filter(g => g.id === gameId).forEach(g => {
                    g.players.forEach(p => {
                        // Find the WebSocket connection for each player and send the update
                        const playerWs = wss.clients.find(client => client.playerId === p);
                        if (playerWs) {
                            playerWs.send(`Player "${playerId}" joined game "${gameId}"`);
                        }
                    });
                });
            } else {
                ws.send(`Game "${gameId}" not found`);
            }
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

// Endpoint to retrieve active games
app.get('/games', (req, res) => {
    res.json(games);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

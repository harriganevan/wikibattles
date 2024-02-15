const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
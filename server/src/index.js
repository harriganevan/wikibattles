const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    socket.on('click', (data) => {
        console.log(data);
        io.emit('receive_data', data);
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
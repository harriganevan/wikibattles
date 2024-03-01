const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { getLinksFromPage } = require('./getLinksFromPage.js');
const { router } = require('./routes.js');

const app = express();
app.use(cors());

//need links in router for this
// app.use('/', router);

const server = createServer(app);

//holds players waiting for friend
const waiting = new Map();

let linksSet = new Set();
let links = [];
let currentTitle = '77th British Academy Film Awards';

getLinksFromPage('77th_British_Academy_Film_Awards').then((newLinks) => {
    links = newLinks;
    linksSet = new Set(links);
});

//endpoints
app.post('/links/:title', async (req, res) => {
    const { title } = req.params;
    currentTitle = title;
    links = await getLinksFromPage(title);
    io.emit('receive_titles', { title, links });
    res.sendStatus(200);
});

app.get('/links', (req, res) => {
    res.send({ currentTitle, links });
});

//maybe include lobby in this
app.post('/guess/:guess', async (req, res) => {
    const { guess } = req.params;
    if (linksSet.has(encodeURI(guess))) {
        currentTitle = guess;
        links = await getLinksFromPage(guess);
        linksSet = new Set(links);
        io.emit('receive_titles', { currentTitle, links });
        res.send({ correct: true });
    }
    else {
        res.send({ correct: false });
    }
});

//socketio server mounted on nodejs HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

const rooms = io.of("/").adapter.rooms;

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    // socket.on('challenge-friend-by-link', (data) => {
    //     console.log(data.username);
    //     //enter list of waiting players along with gameId
    //     // maybe a map that maps gameId to starting players data
    // });
    // socket.on('accept-challenge-by-link', (data) => {
    //     //look for gameId in waiting list (map)
    //     //if its there - emit initiate-game to both players
    //     //otherwise - error
    // });
    socket.on('join-game-room', (data) => {
        //add check to here to make sure room isnt greater than 1
        socket.join(data.gameId);
        //check the length of the room.
        console.log(rooms);

    });
    socket.on('join-game-room-from-link', (data) => {
        //check if room still exists
        socket.join(data.gameId);
        console.log(rooms);
        io.to(data.gameId).emit('initiate-game', { 
            startingPage: 'starting page',
            connectedPages: [],
            gameId: data.gameId,
            playerTurn: 1,
            secondsPerTurn: 20
         });
        //if someone else tries to join it shouldnt let them
        //if length == two - broadcast inititate game to room
    });
    socket.on('leave-game-room', (data) => {
        socket.leave(data.gameId);
    })
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
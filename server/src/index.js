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

//make a map of rooms to links (any info i dont want on client??? )
//maybe do the waiting room thing so i can share info between players
//gameId maps to player with username, challengeParams
//it needs to store it somewhere

const searching = new Map();

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
    socket.on('challenge-friend-by-link', (data) => {
        data.socketId = socket.id
        searching.set(data.gameId, data);
        console.log(searching);
    })
    socket.on('join-game-room', (data) => {
        socket.join(data.gameId);
        console.log(rooms);
    });
    socket.on('accept-challenge-by-link', (data) => {
        if(searching.has(data.gameId)){
            io.to(socket.id).to(searching.get(data.gameId).socketId).emit('initiate-game', { 
                startingPage: '77th British Academy Film Awards',
                connectedPages: [],
                gameId: data.gameId,
                gameTurn: 1,
                playerTurn: 1,
                playersData: {
                    [data.username]: {
                        playerNumber: 1
                    },
                    [searching.get(data.gameId).username]: {
                        playerNumber: 2
                    }
                },
                secondsPerTurn: 20
            });
            searching.delete(data.gameId);
            console.log(searching)
        }
        else {
            io.to(socket.id).emit('game-not-found');
        }
    });
    socket.on('leave-game-room', (data) => {
        searching.delete(data.gameId);
    })
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
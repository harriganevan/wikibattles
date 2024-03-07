const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { getLinksFromPage } = require('./getLinksFromPage.js');
const { router } = require('./routes.js');
const { encode } = require('node:punycode');

const app = express();
app.use(cors());

//need links in router for this
// app.use('/', router);

const server = createServer(app);

//make a map of rooms to links (any info i dont want on client??? )
//maybe do the waiting room thing so i can share info between players
//gameId maps to player with username, challengeParams
//it needs to store it somewhere

const games = new Map();
//make this into game - it keeps game data that will remain on server
//users - current title/links
//gameid, {users: [{username, socketid}, {username2, socketid}], currentTitle: "title", linkSet: Set()}

let linksSet = new Set();
let links = [];
let currentTitle = encodeURI('77th British Academy Film Awards');

getLinksFromPage(currentTitle).then((newLinks) => {
    links = newLinks;
    linksSet = new Set(links);
});

//endpoints - not used rn
// app.post('/links/:title', async (req, res) => {
//     const { title } = req.params;
//     currentTitle = title;
//     links = await getLinksFromPage(title);
//     io.emit('receive_titles', { title, links });
//     res.sendStatus(200);
// });

// app.get('/links', (req, res) => {
//     res.send({ currentTitle, links });
// });

// app.post('/guess/:guess', async (req, res) => {
//     const { guess } = req.params;
//     if (linksSet.has(encodeURI(guess))) {
//         currentTitle = encodeURI(guess);
//         links = await getLinksFromPage(guess);
//         linksSet = new Set(links);
//         io.emit('receive_titles', { currentTitle, links });
//         res.send({ correct: true });
//     }
//     else {
//         res.send({ correct: false });
//     }
// });

//socketio server mounted on nodejs HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

const rooms = io.of("/").adapter.rooms;

io.on('connection', (socket) => {
    //connection events
    console.log('a user connected: ', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('challenge-friend-by-link', async (data) => {
        //get data for linkSet
        links = await getLinksFromPage(encodeURI('77th British Academy Film Awards'));
        linksSet = new Set(links);
        games.set(data.gameId, {
            users: [{ username: data.username, socketId: socket.id }],
            currentTitle: "77th British Academy Film Awards",
            linksSet,
        });
        console.log(games);
    });
    socket.on('join-game-room', (data) => {
        socket.join(data.gameId);
        console.log(rooms);
    });
    socket.on('accept-challenge-by-link', (data) => {
        if (games.has(data.gameId) && games.get(data.gameId).users.length == 1) {
            games.get(data.gameId).users.push({ username: data.username, socketId: socket.id });
            io.to(games.get(data.gameId).users[0].socketId).to(games.get(data.gameId).users[1].socketId).emit('initiate-game', {
                currentPage: encodeURI('77th British Academy Film Awards'),
                connectedPages: [],
                gameId: data.gameId,
                gameTurn: 1,
                playerTurn: 1,
                playersData: {
                    [games.get(data.gameId).users[0].username]: {
                        playerNumber: 1
                    },
                    [games.get(data.gameId).users[1].username]: {
                        playerNumber: 2
                    }
                },
                secondsPerTurn: 20
            });
        }
        else {
            io.to(socket.id).emit('game-not-found');
        }
        console.log(games);
    });
    socket.on('leave-game-room', (data) => {
        games.delete(data.gameId);
    });

    //game events
    socket.on('submit-page', async (data) => {
        console.log(data);
        const gameState = data.gameState;
        if (games.get(data.gameState.gameId).linksSet.has(data.guess) && !gameState.connectedPages.includes(data.guess)) {

            gameState.connectedPages.push(gameState.currentPage);
            gameState.currentPage = data.guess;
            gameState.gameTurn += 1;
            gameState.playerTurn == 1 ? gameState.playerTurn = 2 : gameState.playerTurn = 1;

            io.to(data.gameState.gameId).emit('update-game', { gameState });

            //update server game state with new linksSet
            const links = await getLinksFromPage(data.guess);
            const linksSet = new Set(links);

            games.get(data.gameState.gameId).currentTitle = data.guess;
            games.get(data.gameState.gameId).linksSet = linksSet;

            console.log(games);
        } else {
            io.to(socket.id).emit('wrong');
        }



        /////////////////////////////////////////////////////
        // const { guess } = req.params;
        // if (linksSet.has(encodeURI(guess))) {
        //     currentTitle = guess;
        //     links = await getLinksFromPage(guess);
        //     linksSet = new Set(links);
        //     io.emit('receive_titles', { currentTitle, links });
        //     res.send({ correct: true });
        // }
        // else {
        //     res.send({ correct: false });
        // }

    });

});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
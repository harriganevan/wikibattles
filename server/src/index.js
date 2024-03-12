const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { getLinksFromPage } = require('./getLinksFromPage.js');

const app = express();
app.use(cors());

const server = createServer(app);

//socketio server mounted on nodejs HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

//queue for people searching for games
//should only have 1 player in it at most at any time
const queue = [];

//games holds a game state meant for the backend
//{gameId: {users, currentPage, timePerTurn, linksSet, timerId}}
const games = new Map();

const rooms = io.of("/").adapter.rooms;

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    //lobby events

    //event that puts player in queue
    socket.on('find-game', () => {
        //check if player is in queue
        //if not add this player to queue
        //
    });

    socket.on('challenge-friend-by-link', async (data) => {
        links = await getLinksFromPage(encodeURI(data.settings.startingPage));
        linksSet = new Set(links);
        games.set(data.gameId, {
            users: [{ username: data.username, socketId: socket.id }],
            currentPage: data.settings.startingPage,
            timePerTurn: data.settings.timePerTurn,
            linksSet,
            timerId: null,
        });
        console.log(games);
    });
    socket.on('accept-challenge-by-link', (data) => {
        if (games.has(data.gameId) && games.get(data.gameId).users.length == 1) {
            games.get(data.gameId).users.push({ username: data.username, socketId: socket.id });
            io.to(games.get(data.gameId).users[0].socketId).to(games.get(data.gameId).users[1].socketId).emit('initiate-game', {
                currentPage: games.get(data.gameId).currentPage,
                connectedPages: [games.get(data.gameId).currentPage],
                gameId: data.gameId,
                gameTurn: 1,
                playerTurn: 1,
                playersData: {
                    [games.get(data.gameId).users[0].username]: {
                        playerNumber: 1,
                        username: games.get(data.gameId).users[0].username,
                    },
                    [games.get(data.gameId).users[1].username]: {
                        playerNumber: 2,
                        username: games.get(data.gameId).users[1].username,
                    }
                },
                secondsPerTurn: games.get(data.gameId).timePerTurn
            });
        }
        else {
            io.to(socket.id).emit('game-not-found');
        }
        console.log(games);

        games.get(data.gameId).timerId = setTimeout(() => io.to(data.gameId).emit('game-over'), games.get(data.gameId).timePerTurn * 1000);

    });

    //join / leave room events
    socket.on('join-game-room', (data) => {
        socket.join(data.gameId);
        console.log(rooms);
    });
    socket.on('leave-game-room', (data) => {
        games.delete(data.gameId);
    });

    //game events
    socket.on('submit-page', async (data) => {
        const gameState = data.gameState;
        if (games.get(data.gameState.gameId).linksSet.has(data.guess) && !gameState.connectedPages.includes(data.guess)) {

            //clear timer
            clearTimeout(games.get(data.gameState.gameId).timerId);
            //set timer with gameId
            games.get(data.gameState.gameId).timerId = setTimeout(() => io.to(data.gameState.gameId).emit('game-over'), games.get(data.gameState.gameId).timePerTurn * 1000);
            //^^^ send back copy of gamestate for displaying winner? they already have a copy? should still send one back to be sure
            //have functin do something to backend game state - set it to over

            gameState.connectedPages.push(data.guess);
            gameState.currentPage = data.guess;
            gameState.gameTurn += 1;
            gameState.playerTurn == 1 ? gameState.playerTurn = 2 : gameState.playerTurn = 1;

            io.to(data.gameState.gameId).emit('update-game', { gameState });

            //update server game state with new linksSet
            const links = await getLinksFromPage(data.guess);
            const linksSet = new Set(links);

            games.get(data.gameState.gameId).currentPage = data.guess;
            games.get(data.gameState.gameId).linksSet = linksSet;

            console.log(games);
        } else {
            io.to(socket.id).emit('wrong');
        }
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
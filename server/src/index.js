const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { getLinksFromPage } = require('./getLinksFromPage.js');
const { CronJob } = require('cron');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = createServer(app);

//need battle weekly pages for random games

const weeklyPages = [
    { startPage: 'Heavy_industry', endPage: 'Air pollution' }, //sunday
    { startPage: 'Biological agent', endPage: 'DNA' }, //monday
    { startPage: 'Molecule', endPage: 'Sigma bond' }, //tuesday
    { startPage: 'International Science Council', endPage: 'New Zealand' }, //wednesday
    { startPage: 'French Polynesia', endPage: 'France' }, //thursday
    { startPage: 'Maxwell M. Kalman', endPage: 'Great Depression' }, //friday
    { startPage: 'Ignaz Semmelweis', endPage: 'Mathematics' }, //saturday
]

//set day of week (0 = sunday, ..., 6 = saturday) when server starts/restarts
let dayOfWeek = new Date().getDay().toLocaleString("en-US", { timeZone: 'America/New_York' });

//CronJob for executing funtion at midnight
const job = new CronJob(
    '0 0 0 * * *', // tick every day at midnight
    async function () {
        dayOfWeek++;
        dayOfWeek = (dayOfWeek % 7);
    }, // onTick
    null, // onComplete
    true, // start
    'America/New_York' // timeZone
);

//endpoints for daily puzzle
app.get('/getDailyPages', (req, res) => {
    res.json(weeklyPages[dayOfWeek]);
})

//socketio server mounted on nodejs HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

//games holds a game state meant for the backend
//{gameId: {users, currentPage, timePerTurn, linksSet, timerId}}
const games = new Map();

//used so i can delete a game if player disconnects
//map socketId -> gameId
//*currently only used for when someone waiting for linked player to join disconnects*
const playersGame = new Map();

//queue for people searching for games
//should only have 1 player in it at most at any time
//map socketId -> username
const waiting = new Map();

//just for viewing rooms
const rooms = io.of("/").adapter.rooms;

//if a player in a room disconnects
io.of("/").adapter.on('leave-room', (room, id) => {
    io.to(room).emit('player-left', { id });
});

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    socket.on('disconnect', () => {
        //if that disconnected user was waiting for linked player join
        if (games.get(playersGame.get(socket.id)) && games.get(playersGame.get(socket.id)).users.length === 1) {
            games.delete(playersGame.get(socket.id));
        }
        //if that disconnected user was searching for a game
        waiting.delete(socket.id);
        console.log('user disconnected');
    });

    //lobby events ****************************************************

    //event that puts player in queue
    socket.on('find-game', async (data) => {
        //if there isnt someone in queue - put player in queue
        if (waiting.size === 0) {
            waiting.set(socket.id, { username: data.username, socketId: socket.id });
            io.to(socket.id).emit('waiting');
        } else { // match found
            const waitingPlayer = waiting.keys().next().value;
            const secondPlayer = waiting.get(waitingPlayer);
            waiting.delete(waitingPlayer);
            const gameId = uuidv4();
            links = await getLinksFromPage(encodeURI('77th British Academy Film Awards'));
            linksSet = new Set(links);
            games.set(gameId, {
                users: [{ username: data.username, socketId: socket.id }, { username: secondPlayer.username, socketId: secondPlayer.socketId }],
                currentPage: '77th British Academy Film Awards',
                timePerTurn: 20,
                linksSet,
                timerId: null,
            });
            io.to(socket.id).to(secondPlayer.socketId).emit('initiate-game', {
                //if i want imgs and descr  i need to include those here
                currentPage: '77th British Academy Film Awards',
                connectedPages: ['77th%20British%20Academy%20Film%20Awards'],
                gameId: gameId,
                gameTurn: 1,
                playerTurn: 1,
                playersData: {
                    [secondPlayer.username]: {
                        playerNumber: 1,
                        username: data.username,
                    },
                    [data.username]: {
                        playerNumber: 2,
                        username: secondPlayer.username,
                    }
                },
                secondsPerTurn: 20
            });

            games.get(gameId).timerId = setTimeout(() => {
                io.to(gameId).emit('game-over');
                games.delete(gameId);
            }, games.get(gameId).timePerTurn * 1000);
        }
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

        playersGame.set(socket.id, data.gameId);

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

            games.get(data.gameId).timerId = setTimeout(() => {
                io.to(data.gameId).emit('game-over');
                games.delete(data.gameId);
            }, games.get(data.gameId).timePerTurn * 1000);
        }
        else {
            io.to(socket.id).emit('game-not-found');
        }
        console.log(games);

    });

    //join / leave room events ***************************************************
    socket.on('join-game-room', (data) => {
        socket.join(data.gameId);
        console.log(rooms);
    });

    //make this on disconnect?
    socket.on('leave-game-room', (data) => {
        games.delete(data.gameId);
    });

    socket.on('stop-search', (data) => {
        waiting.delete(data.socketId);
    });

    //game events *******************************************************************
    socket.on('submit-page', async (data) => {
        const gameState = data.gameState;
        if (games.get(data.gameState.gameId).linksSet.has(data.guess) && !gameState.connectedPages.includes(data.guess)) {

            //clear timer
            clearTimeout(games.get(data.gameState.gameId).timerId);
            //set timer with gameId
            games.get(data.gameState.gameId).timerId = setTimeout(() => {
                io.to(data.gameState.gameId).emit('game-over');
                games.delete(data.gameState.gameId);
            }, games.get(data.gameState.gameId).timePerTurn * 1000);

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
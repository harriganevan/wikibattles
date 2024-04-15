const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { getLinksFromPage } = require('./getLinksFromPage.js');
const { getImgDescr } = require('./getImgDescr.js');
const { randomPages } = require('./randomPages.js');
const { CronJob } = require('cron');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
const server = createServer(app);

const weeklyPages = [
    { startPage: 'Heavy industry', endPage: 'Air pollution' }, //sunday
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

app.get('/getRandomPage', (req, res) => {
    res.json({ page: randomPages[(Math.floor(Math.random() * randomPages.length))] });
})

//socketio server mounted on nodejs HTTP server
const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN,
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
    socket.on('disconnect', () => {
        //if that disconnected user was waiting for linked player join
        if (games.get(playersGame.get(socket.id)) && games.get(playersGame.get(socket.id)).users.length === 1) {
            games.delete(playersGame.get(socket.id));
        }
        //if that disconnected user was searching for a game
        waiting.delete(socket.id);
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
            const title = randomPages[(Math.floor(Math.random() * randomPages.length))];
            const links = await getLinksFromPage(title);
            const linksSet = new Set(links);
            const imgdescr = await getImgDescr(title);
            games.set(gameId, {
                users: [{ username: data.username, socketId: socket.id }, { username: secondPlayer.username, socketId: secondPlayer.socketId }],
                currentPage: encodeURI(title),
                timePerTurn: 20,
                linksSet,
                timerId: null,
            });
            io.to(socket.id).to(secondPlayer.socketId).emit('initiate-game', {
                currentPage: encodeURI(title),
                connectedPages: [encodeURI(title)],
                pageData: [{ title: title, thumbnail: { url: imgdescr.thumbnail }, description: imgdescr.description }],
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

            console.log(games); //////////////
        }
    });

    socket.on('challenge-friend-by-link', async (data) => {
        const links = await getLinksFromPage(data.settings.startingPage);
        const linksSet = new Set(links);
        const imgdescr = await getImgDescr(data.settings.startingPage);
        games.set(data.gameId, {
            users: [{ username: data.username, socketId: socket.id }],
            currentPage: encodeURI(data.settings.startingPage),
            timePerTurn: encodeURI(data.settings.timePerTurn),
            linksSet,
            startingPageData: { title: data.settings.startingPage, thumbnail: { url: imgdescr.thumbnail }, description: imgdescr.description },
            timerId: null,
        });
        playersGame.set(socket.id, data.gameId);

        console.log(games);//////////////////////////
    });

    socket.on('accept-challenge-by-link', (data) => {
        if (games.has(data.gameId) && games.get(data.gameId).users.length == 1) {
            const game = games.get(data.gameId);
            game.users.push({ username: data.username, socketId: socket.id });
            io.to(game.users[0].socketId).to(game.users[1].socketId).emit('initiate-game', {
                currentPage: game.currentPage,
                connectedPages: [game.currentPage],
                pageData: [{ title: game.startingPageData.title, thumbnail: game.startingPageData.thumbnail, description: game.startingPageData.description }],
                gameId: data.gameId,
                gameTurn: 1,
                playerTurn: 1,
                playersData: {
                    [game.users[0].username]: {
                        playerNumber: 1,
                        username: game.users[0].username,
                    },
                    [game.users[1].username]: {
                        playerNumber: 2,
                        username: game.users[1].username,
                    }
                },
                secondsPerTurn: game.timePerTurn
            });

            game.timerId = setTimeout(() => {
                io.to(data.gameId).emit('game-over');
                games.delete(data.gameId);
            }, game.timePerTurn * 1000);
        }
        else {
            io.to(socket.id).emit('game-not-found');
        }
    });

    //ready up events!!!!!!!!!!!

    //join / leave room events ***************************************************
    socket.on('join-game-room', (data) => {
        socket.join(data.gameId);
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
        if (games.get(data.gameState.gameId).linksSet.has(data.guess.title) && !gameState.connectedPages.includes(data.guess.title)) {

            //clear timer
            clearTimeout(games.get(data.gameState.gameId).timerId);
            //set timer with gameId - move this to bottom?
            games.get(data.gameState.gameId).timerId = setTimeout(() => {
                io.to(data.gameState.gameId).emit('game-over');
                games.delete(data.gameState.gameId);
            }, games.get(data.gameState.gameId).timePerTurn * 1000);
            gameState.connectedPages.push(data.guess.title);
            gameState.pageData.push({ title: data.guess.title, thumbnail: data.guess.thumbnail, description: data.guess.description })
            gameState.currentPage = data.guess.title;
            gameState.gameTurn += 1;
            gameState.playerTurn == 1 ? gameState.playerTurn = 2 : gameState.playerTurn = 1;

            io.to(data.gameState.gameId).emit('update-game', { gameState });

            const links = await getLinksFromPage(data.guess.title);
            const linksSet = new Set(links);

            games.get(data.gameState.gameId).currentPage = data.guess.title;
            games.get(data.gameState.gameId).linksSet = linksSet;

        } else {
            io.to(socket.id).emit('wrong');
        }
    });
});

server.listen(3000, () => {
    console.log('server running on port 3000');
});
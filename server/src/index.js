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

//store room objects in here? (game object)
//{roomid, links, currentTitle, linksSet}
const rooms = []

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

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    //join room
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
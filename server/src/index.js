const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const { getPage } = require('./getPage.js');
const { router } = require('./routes.js');

const app = express();
app.use(cors());

//need links in router for this
// app.use('/', router);

const server = createServer(app);

let links = []

getPage('/wiki/77th_British_Academy_Film_Awards').then((newLinks) => {
    links = newLinks;
});

//endpoints
app.post('/links/:title', async (req, res) => {
    const { title } = req.params;
    console.log(title);
    links = await getPage(title.replace('%2F', '/'));
    io.emit('receive_titles', links);
    res.sendStatus(200);
})

app.get('/links', (req, res) => {
    res.send({ links });
})

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
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
const express = require('express');
const router = express.Router();

router.post('/links/:title', async (req, res) => {
    const { title } = req.params;
    console.log(title);
    links = await getPage(title.replace('%2F', '/'));
    io.emit('receive_titles', links);
})

router.get('/links', (req, res) => {
    res.send({ links });
})

exports.router = router;
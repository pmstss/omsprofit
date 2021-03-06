const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();

app.use(compression({ threshold: 0 }));

app.use(express.static(__dirname + '/dist/omsprofit'));

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname + '/robots.txt'));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/omsprofit/index.html'));
});

app.listen(process.env.PORT || 8080);

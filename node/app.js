const express = require('express');
const config = require('./config');

const app = express();

app.use(express.static(__dirname + '/public'));

app.listen(config.port);
console.log(`started @ ${config.port}`);

const express = require('express');

const compress = require('compression')
const bodyParser = require('body-parser')

const config = require('./config');

const app = express();

app.use(compress())
  .use(express.static(__dirname + '/public'))
  .use(bodyParser.json());

const model = require('./model');
model.setRestApi(app);

app.listen(config.port);
console.log(`started @ ${config.port}`);

const path = require('path');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');

const config = require('./config');

const app = express();

setHeader(app);

// use mid
app.use(compress())
  .use(bodyParser.json())
  .use(express.static(__dirname + '/public'));


const model = require('./model');
model.setRestApi(app);

// render
app.engine('.html', require('ejs').__express);
// 设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'public'));

function setHeader(app) {
  app.all('*', function(req, res, next) {
    // for local dev
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });
}


app.get('/*', function (req, res) {
  res.render('index', function (err, html) {
    res.send(html);
  });
});


app.listen(config.port);
console.log(`started @ ${config.port}`);

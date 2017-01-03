const path = require('path');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');

const config = require('./config');

const app = express();

// use mid
app.use(compress())
  .use(express.static(__dirname + '/public'))
  .use(bodyParser.json());

const model = require('./model');
model.setRestApi(app);

// render
app.engine('.html', require('ejs').__express);
// 设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'public'));

app.get('/*', function (req, res) {
  res.render('index', function (err, html) {
    console.log('test');
    res.send(html);
  });
});


app.listen(config.port);
console.log(`started @ ${config.port}`);

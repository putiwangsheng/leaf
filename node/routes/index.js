const fs = require('fs');

module.exports = function(app) {
  fs.readdir(__dirname, (err, files) => {
    if (err) {
      return;
    }
    files.forEach((item) => {
      if (item.match(/.+\.js$/i) && item !== 'index.js') {
        require('./' + item)(app);
      }
    })
  });
}

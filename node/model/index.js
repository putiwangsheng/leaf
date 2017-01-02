const mongoose = require('mongoose');
const mongoUrl = require('../config').mongoUrl;
const restful = require('node-restful');

const model = [
  {
    name: 'user',
    schema: require('./user.js').userSchema
  }
]

const db = mongoose.connect(mongoUrl);

// init model
model.forEach(function (item) {
  db.model(item.name, item.schema)
})


// set rest api
exports.setRestApi = function (app) {

  model.forEach(function (item) {

    rest = restful.model(
      item.name, item.schema
    ).methods(['get', 'put', 'post', 'delete'])

    rest.register(app, '/api/' + item.name);
  })

}

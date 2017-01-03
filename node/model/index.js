const mongoose = require('mongoose');
const mongoUrl = require('../config').mongoUrl;
const restful = require('node-restful');

const models = [
  {
    name: 'user',
    schema: require('./user.js').userSchema
  }
];

const db = mongoose.connect(mongoUrl);

// init models
models.forEach(function (item) {
  db.model(item.name, item.schema);
});


// set rest api
exports.setRestApi = function (app) {

  models.forEach(function (item) {

    const resource = restful.model(
      item.name, item.schema
    ).methods(['get', 'put', 'post', 'delete']);

    resource.register(app, '/api/' + item.name);
  });

};

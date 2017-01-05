const mongoose = require('mongoose');
const mongoUrl = require('../config').mongoUrl;
const restful = require('node-restful');
const schemas = require('./schema.js');

const models = [
  {
    name: 'user',
    schema: schemas.userSchema
  },
  {
    name: 'repo',
    schema: schemas.repoSchema
  },
  {
    name: 'doc',
    schema: schemas.docSchema
  },
  {
    name: 'team',
    schema: schemas.teamSchema
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

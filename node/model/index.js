const mongoose = require('mongoose');
const mongoUrl = require('../config').mongoUrl;
const restful = require('node-restful');
const schemas = require('./schema.js');

const models = [
  {
    name: 'user',
    schema: schemas.userSchema,
    dbModel: undefined, // defined in init models
  },
  {
    name: 'repo',
    schema: schemas.repoSchema,
    dbModel: undefined, // defined in init models
  },
  {
    name: 'doc',
    schema: schemas.docSchema,
    dbModel: undefined, // defined in init models
  },
  {
    name: 'team',
    schema: schemas.teamSchema,
    dbModel: undefined, // defined in init models
  },
  {
    name: 'label',
    schema: schemas.labelSchema,
    dbModel: undefined, // defined in init models
  }
];

// link db
const db = mongoose.connect(mongoUrl);

// init models
models.forEach(function (item) {
  item.dbModel = db.model(item.name, item.schema);
});

const service = require('./service').createService(models);


// set rest api
exports.setRestApi = function (app) {

  models.forEach(function (item) {

    const resource = restful.model(
      item.name, item.schema
    ).methods(['get', 'put', 'post', 'delete']);


    if (item.name === 'doc') {
      service.addDocInTOC(resource);
      service.deleteDocInTOC(resource);
    }

    // must register at end
    resource.register(app, '/api/' + item.name);
  });

};

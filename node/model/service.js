// let userDbModel;
// let repoDbModel;
let docDbModel;
// let teamDbModel;

exports.createService = function(models) {
  // userDbModel = getDbModel(models, 'user');
  // repoDbModel = getDbModel(models, 'repo');
  docDbModel = getDbModel(models, 'doc');
  // teamDbModel = getDbModel(models, 'team');


  return {
    addIndexInDoc
  };
};

function addIndexInDoc(resource) {
  resource.after('post', function(req, res, next) {
    const repoId = req.body.repoId;
    docDbModel.find({ repoId: repoId }, (err, docs) => {
      const index = docs.length + 1;

      // res.locals.bundle 很重要，是当前请求的资源的数据，通过它可以读写数据
      res.locals.bundle.info.repoIndex = index;
      res.locals.bundle.save();

      next(); // Don't forget to call next!
    });
  });
}

function getDbModel(models, name) {
  return models.filter(item => item.name === name)[0].dbModel;
}

exports.createService = function(models) {
  // const userDbModel = getDbModel(models, 'user');
  const repoDbModel = getDbModel(models, 'repo');
  const docDbModel = getDbModel(models, 'doc');
  // const teamDbModel = getDbModel(models, 'team');

  return {
    addDocInTOC,
    deleteDocInTOC
  };

  function addDocInTOC(resource) {
    resource.after('post', function(req, res, next) {
      const repoId = req.body.repoId;

      repoDbModel.find({ _id: repoId }, (err, docs) => {
        // res.locals.bundle 很重要，是当前请求的资源的数据，通过它可以读写数据
        const docId = res.locals.bundle._id;

        docs[0].tableOfContents.push({
          docId
        });

        docs[0].save();

        next(); // Don't forget to call next!
      });
    });
  }

  function deleteDocInTOC(resource) {
    resource.before('delete', function (req, res, next) {
      const docId = req.params.id;

      docDbModel.find({ _id: docId }, (err, docs) => {
        const repoId = docs[0].repoId;

        repoDbModel.find({ _id: repoId }, (err, repoDocs) => {
          const tableOfContents = repoDocs[0].tableOfContents;
          const index = tableOfContents.findIndex(item => item.docId === docId);

          if (index === -1) {
            next();
            return;
          }

          tableOfContents.splice(index, 1);
          repoDocs[0].save();

          next();
        });
      });
    });
  }

  function getDbModel(models, name) {
    return models.filter(item => item.name === name)[0].dbModel;
  }
};

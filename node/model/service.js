exports.createService = function(models) {
  // const userDbModel = getDbModel(models, 'user');
  const repoDbModel = getDbModel(models, 'repo');
  const docDbModel = getDbModel(models, 'doc');
  // const teamDbModel = getDbModel(models, 'team');

  return {
    addDocInTOC,
    deleteDocInTOC,
    deleteRepoInTOC
  };

  function addDocInTOC(resource) {
    resource.after('post', function(req, res, next) {
      const repoId = req.body.repoId;

      repoDbModel.find({
        _id: repoId
      }, (err, docs) => {
        // res.locals.bundle 很重要，是当前请求的资源的数据，通过它可以读写数据
        const docId = res.locals.bundle._id;

        docDbModel.find({
          _id: docId
        }, (err, doc) => {
          if (doc[0].info.publishContent) {
            docs[0].tableOfContents.push({
              docId
            });

            docs[0].save();
          }

          next(); // Don't forget to call next!
        })
      });
    });
  }

  // 删除文档同时修改 tableOfContents
  function deleteDocInTOC(resource) {
    resource.before('delete', function(req, res, next) {
      const docId = req.params.id;

      docDbModel.find({
        _id: docId
      }, (err, docs) => {
        const repoId = docs[0].repoId;

        repoDbModel.find({
          _id: repoId
        }, (err, repoDocs) => {
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

  function deleteRepoInTOC(resource) {
    resource.before('delete', function(req, res, next) {
      const repoId = req.params.id;

      repoDbModel.find({
        _id: repoId
      }, (err, repos) => {
        const tableOfContents = repos[0].tableOfContents;

        docDbModel.find({}, (err, docs) => {
          tableOfContents.forEach((item) => {
            const index = docs.findIndex(docItem => {
              return docItem._id == item.docId;
            });

            if (index === -1) {
              next();
              return;
            }

            docs.splice(index, 1);
          })
          
          next();
        })
      });
    });
  }

  function getDbModel(models, name) {
    return models.filter(item => item.name === name)[0].dbModel;
  }
};

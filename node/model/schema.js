const mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
  info: {
    avatar: { type: String },
    nickName: { type: String, unique: true, require: true },
    name: { type: String },
    email: { type: String, unique: true, require: true},
    job: { type: String },
    department: { type: String }
  },
  collectedReposIds: [{type: String}]
});

exports.teamSchema = new mongoose.Schema({
  membersIds: [{ type: String, require: true }]
});

exports.repoSchema = new mongoose.Schema({
  creatorId: { type: String, require: true },
  repoName: { type: String, require: true },
  intro: { type: String },
  isPublic: { type: Boolean, default: true }
});

exports.docSchema = new mongoose.Schema({
  repoId: { type: String, require: true },
  creatorId: { type: String, require: true },
  info: {
    title: { type: String },
    publishContent: { type: String },
    draftContent: { type: String },
    repoIndex: { type: String },
    rank: { type: Number, default: 1 }
  }
});

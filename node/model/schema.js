const mongoose = require('mongoose');

// 用户信息表结构
exports.userSchema = new mongoose.Schema({
  info: {
    avatar: { type: String },
    nickName: { type: String, require: true },
    name: { type: String },
    email: { type: String, unique: true },
    job: { type: String },
    department: { type: String }
  },
  openId: { type: String, unique: true, require: true },
  collectedReposIds: [{type: String}]
});

// 团队信息表结构
exports.teamSchema = new mongoose.Schema({
  members: [
    {
      authority: { type: String, require: true },
      userId: { type: String, require: true }
    }
  ],
  name: {type: String, require: true},
  avatar: {type: String},
  intro: {type: String},
  isPrivate: {type: Boolean, default: false}
});

// 仓库信息表结构
exports.repoSchema = new mongoose.Schema({
  creatorId: { type: String, require: true },
  repoName: { type: String, require: true },
  intro: { type: String },
  isPrivate: { type: Boolean, default: false },
  tableOfContents: [
    {
      rank: { type: Number, default: 1 },
      docId: { type: String, require: true }
    }
  ]
});

// 文档信息表结构
exports.docSchema = new mongoose.Schema({
  repoId: { type: String, require: true },
  creatorId: { type: String, require: true },
  info: {
    title: { type: String },
    publishContent: { type: String },
    draftContent: { type: String }
  }
});

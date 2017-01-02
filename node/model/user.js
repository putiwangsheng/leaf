const mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
  nickName: { type: String }
})

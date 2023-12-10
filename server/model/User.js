const mongoose = require('mongoose')

var schema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  status: {
    type: Boolean,
    default: true,
  },
})

const User = mongoose.model('user', schema)

module.exports = User

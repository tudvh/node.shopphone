const mongoose = require('mongoose')

var schema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

const Banner = mongoose.model('banner', schema)

module.exports = Banner

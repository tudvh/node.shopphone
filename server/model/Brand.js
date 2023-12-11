const mongoose = require('mongoose')

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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

const Brand = mongoose.model('brand', schema)

module.exports = Brand

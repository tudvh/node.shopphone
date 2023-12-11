const mongoose = require('mongoose')
const Category = require('./Category')
const Brand = require('./Brand')

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Category.schema,
    required: true,
  },
  brand: {
    type: Brand.schema,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
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

const Product = mongoose.model('product', schema)

module.exports = Product

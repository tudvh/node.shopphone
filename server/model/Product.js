const mongoose = require('mongoose')

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'brand',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: [String],
    required: true,
    validate: {
      validator: function (array) {
        return array.length > 0
      },
      message: 'Phải có ít nhất một Image url',
    },
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

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
  },
  off: {
    type: Number,
  },
  affiliateLink: {
    type: String,
    required: true
  },
  category: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Category',
    // required: true
    type: String, 
  },
  imageUrl: String,
  shareCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
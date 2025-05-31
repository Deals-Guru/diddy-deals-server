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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  shareCode: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  }
}, { _id: false });

const specificationSchema = new mongoose.Schema({
  key: {
    type: String
  },
  value: {
    type: String
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: String,
  rating: Number,
  reviews: Number,
  id: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: [String],
  },
  descriptions: {
    type: [String],
  },
  highlights: [String],
  specifications: [specificationSchema],
  mrp: {
    type: Number,
  },
  off: {
    type: Number,
  },
  affiliateLink: {
    type: String,
  },
  price: Number,
  shareCode: String,
  category: {
    type: String, 
  },
  imageUrl: String,
  images: [String],
  deals: {
    type: [dealSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
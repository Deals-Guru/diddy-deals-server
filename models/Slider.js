// models/Slider.js
const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Slider', sliderSchema);
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Slider = require('../models/Slider');

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let products;
    if (category && category !== 'featured') {
      products = await Product.find({ category }).populate('category');
    } else {
      products = await Product.find().populate('category');
    }

    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/redirect', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).json({ error: 'Product not found' });
    
    product.clicks += 1;
    await product.save();
    
    res.redirect(product.affiliateLink);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/sliders', async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
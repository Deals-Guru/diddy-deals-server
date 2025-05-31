const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

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
    const products = await Product.find({ category }).populate('category');
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

module.exports = router;
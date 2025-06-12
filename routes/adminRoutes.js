const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Slider = require('../models/Slider');
const verifyToken = require('../middleware/verifyToken');
const UUID = require('uuid'); 

// Apply token verification to all admin routes
router.use(verifyToken);

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const { name, description, price, mrp, off, affiliateLink, shareCode, category, imageUrl } = req.body;
        const id = UUID.v4(); 

        const newProduct = new Product({
            name,
            id,
            description,
            price,
            mrp,
            off,
            affiliateLink,
            shareCode,
            category,
            imageUrl
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ id: id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(product._id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ id: id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const updatedProduct = await Product.findByIdAndDelete(product._id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
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

router.post('/sliders', async (req, res) => {
    try {
        const { title, description, imageUrl, link } = req.body;
        const id = UUID.v4();

        const newSlider = new Slider({
            title,
            id,
            description,
            imageUrl,
            link
        });

        await newSlider.save();
        res.status(201).json(newSlider);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/sliders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const slider = await Slider.findOne({ id: id});
        if (!slider) {
            return res.status(404).json({ error: 'SLider not found' });
        }
        const updatedSlider = await Slider.findByIdAndUpdate(slider._id, req.body, { new: true });
        res.json(updatedSlider);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/sliders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const slider = await Slider.findOne({ id: id});
        if (!slider) {
            return res.status(404).json({ error: 'SLider not found' });
        }
        await Slider.findByIdAndDelete(slider._id);
        res.json({ message: 'Slider deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/verify', (req, res) => {
    const token = req.headers['x-admin-token'] || req.body.token;
    if (!token) {
        return res.status(401).json({ valid: false, message: 'No token provided' });
    }
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ valid: false, message: 'Invalid token' });
    }

    res.json({ valid: true });
});

module.exports = router;
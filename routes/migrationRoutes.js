const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.get('/pro', async (req, res) => {
    try {
        const allProducts = await Product.find();
        
        for (const product of allProducts) {
            const updatedProduct = await Product.findByIdAndUpdate(product._id, {
                description: product.descriptions,
                deals: [
                    {
                        platform: "Amazon",
                        price: product.price,
                        discount: product.off,
                        logo: "🛒",
                        color: "bg-orange-500",
                        link: product.affiliateLink,
                        badge: "Best Seller",
                        shareCode: product.shareCode
                    }
                ]
            }, { new: true });
        }

        res.status(201).json("Products updated successfully");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
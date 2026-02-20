const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Assuming Product model exists
const auth = require('../middleware/auth'); // For protected routes if any

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products, message: 'Products fetched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
});

/**
 * @route GET /api/products/:id
 * @desc Get single product by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product, message: 'Product fetched successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
});

// Example of a protected product route (e.g., for admin to add products)
/**
 * @route POST /api/products
 * @desc Add a new product
 * @access Private (Admin only) - Requires auth middleware
 */
router.post('/', auth, async (req, res) => {
    // In a real app, you'd check req.user.role === 'admin' here
    try {
        const { name, description, price, category, imageUrl, stock } = req.body;
        const newProduct = new Product({ name, description, price, category, imageUrl, stock });
        const product = await newProduct.save();
        res.status(201).json({ success: true, data: product, message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: 'Error adding product', error: error.message });
    }
});


module.exports = router;
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Assuming Order model exists
const auth = require('../middleware/auth'); // JWT authentication middleware

/**
 * @route POST /api/orders
 * @desc Create a new order
 * @access Private (optional, can be public for guest checkout)
 *         For this project, we'll allow both authenticated and guest orders.
 */
router.post('/', async (req, res) => {
  try {
    const { shippingAddress, items, totalAmount, paymentInfo } = req.body;

    // Basic validation
    if (!shippingAddress || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required order fields' });
    }

    // Attach user ID if authenticated
    const userId = req.user ? req.user.id : null; // `req.user` comes from auth middleware if token provided

    const newOrder = new Order({
      user: userId, // Will be null if guest checkout
      shippingAddress,
      items,
      totalAmount,
      paymentInfo: { // Only store necessary, non-sensitive payment info
        method: 'credit_card', // Assuming credit card for now
        last4: paymentInfo.cardNumber ? paymentInfo.cardNumber.slice(-4) : null,
        // Do NOT store full card numbers or CVVs in a real application!
        // Integrate with a payment gateway (Stripe, PayPal, etc.)
      },
      status: 'Pending', // Initial status
    });

    const order = await newOrder.save();
    res.status(201).json({ success: true, data: order, message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error placing order', error: error.message });
  }
});

/**
 * @route GET /api/orders/user/:userId
 * @desc Get all orders for a specific user
 * @access Private (User owns orders)
 */
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Ensure authenticated user is requesting their own orders
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view these orders' });
    }

    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders, message: 'User orders fetched successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching user orders' });
  }
});

// Example of an admin route to get all orders or a single order by ID
/**
 * @route GET /api/orders/:id
 * @desc Get a single order by ID (for admin or user if they own it)
 * @access Private (requires auth, and user must own order or be admin)
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if user is the owner of the order or is an admin (assuming user has a 'role' field)
        // For simplicity, we'll only check if user is the owner for now.
        if (order.user && order.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
        }

        res.json({ success: true, data: order, message: 'Order fetched successfully' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }
        res.status(500).json({ success: false, message: 'Server error fetching order' });
    }
});


module.exports = router;
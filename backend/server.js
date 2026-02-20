require('dotenv').config(); // MUST be the first line

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON request bodies

// CORS setup to allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart'); // This file will also handle auth/user routes
const orderRoutes = require('./routes/orders');

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', cartRoutes); // /api/auth/login, /api/auth/signup, /api/auth/me
app.use('/api/users', cartRoutes); // /api/users/:id
app.use('/api/orders', orderRoutes);

// Serve frontend static files
// This assumes your HTML, CSS, JS are in a 'public' folder at the project root level.
app.use(express.static(path.join(__dirname, '../public')));

// Fallback for SPA routing - serves index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
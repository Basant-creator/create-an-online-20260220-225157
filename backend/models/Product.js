const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['necklaces', 'earrings', 'bracelets', 'rings', 'other'], // Example categories
    lowercase: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: false, // Can be optional if a default image is used
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Add index on category for faster filtering
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text' }); // For text search if needed

module.exports = mongoose.model('Product', ProductSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 0,
    default: 0
  },
  unit: {
    type: String,
    default: 'pcs', // pieces, kg, ltr, etc.
    trim: true
  },
  price: {
    type: Number,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  },
  availability: {
    type: String,
    enum: ['available', 'low-stock', 'out-of-stock'],
    default: 'available'
  },
  image: {
    type: String, // URL or path to image
    default: null
  },
  barcode: {
    type: String,
    trim: true,
    sparse: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Automatically update availability based on quantity
productSchema.pre('save', function(next) {
  if (this.quantity === 0) {
    this.availability = 'out-of-stock';
  } else if (this.quantity <= this.lowStockThreshold) {
    this.availability = 'low-stock';
  } else {
    this.availability = 'available';
  }
  next();
});

// Index for faster queries
productSchema.index({ shop: 1, category: 1 });
productSchema.index({ shop: 1, availability: 1 });

module.exports = mongoose.model('Product', productSchema);

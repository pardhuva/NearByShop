const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide shop name'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make owner optional for temporary shop creation
  },
  description: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    village: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  email: {
    type: String,
    lowercase: true
  },
  category: {
    type: String,
    enum: ['grocery', 'pharmacy', 'electronics', 'clothing', 'hardware', 'stationery', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);

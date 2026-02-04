const express = require('express');
const router = express.Router();
const {
  getAllShops,
  getShop,
  updateShop,
  getNearbyShops
} = require('../controllers/shopController');
const { protect, isOwner } = require('../middleware/auth');

// Public routes
router.get('/', getAllShops);
router.get('/nearby', getNearbyShops);
router.get('/:id', getShop);

// Protected routes (Owner only)
router.put('/:id', protect, isOwner, updateShop);

module.exports = router;

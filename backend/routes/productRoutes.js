const express = require('express');
const router = express.Router();
const {
  getProductsByShop,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategorySummary
} = require('../controllers/productController');
const { protect, isOwnerOrWorker, isOwner } = require('../middleware/auth');

// Public routes
router.get('/shop/:shopId', getProductsByShop);
router.get('/shop/:shopId/categories', getCategorySummary);
router.get('/:id', getProduct);

// Protected routes (Owner/Worker)
router.post('/', protect, isOwnerOrWorker, createProduct);
router.put('/:id', protect, isOwnerOrWorker, updateProduct);

// Protected routes (Owner only)
router.delete('/:id', protect, isOwner, deleteProduct);

module.exports = router;

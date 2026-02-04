const Product = require('../models/Product');

// @desc    Get all products for a shop
// @route   GET /api/products/shop/:shopId
// @access  Public
exports.getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { category, availability, search } = req.query;

    let query = { shop: shopId };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by availability
    if (availability) {
      query.availability = availability;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('lastUpdatedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shop', 'name address phone')
      .populate('lastUpdatedBy', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Owner/Worker)
exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, quantity, unit, price, lowStockThreshold, barcode } = req.body;

    // Verify user has access to this shop
    if (req.user.role !== 'owner' && req.user.role !== 'worker') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add products'
      });
    }

    const product = await Product.create({
      name,
      shop: req.user.shop,
      category,
      description,
      quantity,
      unit,
      price,
      lowStockThreshold,
      barcode,
      lastUpdatedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner/Worker)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has access to this shop
    if (product.shop.toString() !== req.user.shop.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // Update lastUpdatedBy
    req.body.lastUpdatedBy = req.user._id;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is owner and has access to this shop
    if (req.user.role !== 'owner' || product.shop.toString() !== req.user.shop.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get products by category for a shop
// @route   GET /api/products/shop/:shopId/categories
// @access  Public
exports.getCategorySummary = async (req, res) => {
  try {
    const { shopId } = req.params;

    const summary = await Product.aggregate([
      { $match: { shop: mongoose.Types.ObjectId(shopId) } },
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$availability', 'available'] }, 1, 0] }
          },
          lowStock: {
            $sum: { $cond: [{ $eq: ['$availability', 'low-stock'] }, 1, 0] }
          },
          outOfStock: {
            $sum: { $cond: [{ $eq: ['$availability', 'out-of-stock'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

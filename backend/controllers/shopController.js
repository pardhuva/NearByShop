const Shop = require('../models/Shop');
const Product = require('../models/Product');

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
exports.getAllShops = async (req, res) => {
  try {
    const { category, search, village, city, state } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    // Advanced search: shop name, village, city, or state
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { 'address.village': searchRegex },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex }
      ];
    }

    // Specific filters
    if (village) {
      query['address.village'] = { $regex: village, $options: 'i' };
    }
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }
    if (state) {
      query['address.state'] = { $regex: state, $options: 'i' };
    }

    const shops = await Shop.find(query)
      .populate('owner', 'name email phone')
      .select('-workers')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('workers', 'name email');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Get product statistics
    const productStats = await Product.aggregate([
      { $match: { shop: shop._id } },
      {
        $group: {
          _id: '$availability',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...shop.toObject(),
        productStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (Owner only)
exports.updateShop = async (req, res) => {
  try {
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check if user is the owner
    if (shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this shop'
      });
    }

    shop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get nearby shops
// @route   GET /api/shops/nearby
// @access  Public
exports.getNearbyShops = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters (default 5km)

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude'
      });
    }

    const shops = await Shop.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
      .populate('owner', 'name phone')
      .limit(20);

    res.json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

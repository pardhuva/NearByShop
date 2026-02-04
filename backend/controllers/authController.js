const User = require('../models/User');
const Shop = require('../models/Shop');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, shopName, shopAddress } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      // If user exists, update their role and shop if registering as owner
      if (role === 'owner' && !user.shop) {
        if (!shopName) {
          return res.status(400).json({
            success: false,
            message: 'Shop name is required for owner registration',
          });
        }

        // Create shop and assign to user
        const shop = await Shop.create({
          name: shopName,
          owner: user._id,
          address: shopAddress || {},
          phone: phone || '',
        });

        user.role = 'owner';
        user.shop = shop._id;
        await user.save();

        return res.status(200).json({
          success: true,
          message: 'User updated to shop owner',
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            shop: shop._id,
            token: generateToken(user._id),
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }
    }

    // Create new user
    user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password').populate('shop');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shop: user.shop,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('shop');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

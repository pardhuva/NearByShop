import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllShops } from '../redux/slices/shopSlice';
import ShopCard from '../components/Shops/ShopCard';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { shops, isLoading } = useSelector((state) => state.shops);
  const { user } = useSelector((state) => state.auth);
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    village: '',
    city: '',
    state: ''
  });
  const [searchType, setSearchType] = useState('search'); // 'search' or 'advanced'

  useEffect(() => {
    dispatch(getAllShops());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const activeFilters = {};
    
    if (searchType === 'search' && filters.search) {
      activeFilters.search = filters.search;
    } else if (searchType === 'advanced') {
      if (filters.village) activeFilters.village = filters.village;
      if (filters.city) activeFilters.city = filters.city;
      if (filters.state) activeFilters.state = filters.state;
    }
    
    if (filters.category) activeFilters.category = filters.category;
    
    dispatch(getAllShops(activeFilters));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      village: '',
      city: '',
      state: ''
    });
    dispatch(getAllShops());
  };

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <h1>📱 Welcome to <span className="highlight">NearByStock</span></h1>
          <p className="hero-subtitle">
            Discover and check product availability in your favorite local shops.
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">👀</span>
              <h3>Real-time Availability</h3>
              <p>Check stock status before visiting.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🏪</span>
              <h3>Support Local Shops</h3>
              <p>Help your community thrive by shopping locally.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <h3>Fast & Simple</h3>
              <p>Quick and easy access to shop inventories.</p>
            </div>
          </div>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
          </div>
        </section>

        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <h2>🔍 Find Shops Near You</h2>
            
            <div className="search-type-toggle">
              <button 
                className={`toggle-btn ${searchType === 'search' ? 'active' : ''}`}
                onClick={() => setSearchType('search')}
              >
                Quick Search
              </button>
              <button 
                className={`toggle-btn ${searchType === 'advanced' ? 'active' : ''}`}
                onClick={() => setSearchType('advanced')}
              >
                Advanced Search
              </button>
            </div>

            <form onSubmit={handleSearch} className="search-form">
              {searchType === 'search' ? (
                <div className="search-input-group">
                  <input
                    type="text"
                    name="search"
                    className="search-input"
                    placeholder="Search by shop name, village, city, or state..."
                    value={filters.search}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="advanced-filters">
                  <input
                    type="text"
                    name="village"
                    className="form-control"
                    placeholder="Village"
                    value={filters.village}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="City"
                    value={filters.city}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="State"
                    value={filters.state}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="filter-row">
                <select
                  name="category"
                  className="form-control"
                  value={filters.category}
                  onChange={handleInputChange}
                >
                  <option value="">All Categories</option>
                  <option value="grocery">Grocery</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="hardware">Hardware</option>
                  <option value="stationery">Stationery</option>
                  <option value="other">Other</option>
                </select>
                
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </form>

            {shops.length > 0 && (
              <p className="search-results-count">
                Found <strong>{shops.length}</strong> {shops.length === 1 ? 'shop' : 'shops'}
              </p>
            )}
          </div>
        </section>

        {/* Shops Section */}
        <section className="shops-section">
          <div className="section-header">
            <h2>Available Shops</h2>
            {!user && (
              <p className="section-subtitle">
                <Link to="/register">Register as a shop owner</Link> to list your inventory.
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="spinner"></div>
          ) : shops.length > 0 ? (
            <div className="grid">
              {shops.map((shop) => (
                <ShopCard key={shop._id} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No shops found matching your search criteria.</p>
              <button onClick={handleReset} className="btn btn-primary">
                View All Shops
              </button>
            </div>
          )}
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2>What Our Users Say</h2>
          <div className="testimonials">
            <div className="testimonial">
              <p>"NearByStock has made shopping so much easier! I can check availability before heading out."</p>
              <span>- Happy Customer</span>
            </div>
            <div className="testimonial">
              <p>"As a shop owner, I love how I can showcase my inventory to local customers."</p>
              <span>- Shop Owner</span>
            </div>
            <div className="testimonial">
              <p>"A game-changer for local businesses and customers alike!"</p>
              <span>- Community Member</span>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="cta-box">
            <h2>Join the NearByStock Community</h2>
            <p>Whether you're a customer or a shop owner, NearByStock is here to make your life easier.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Register Now
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

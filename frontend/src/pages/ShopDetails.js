import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getShop } from '../redux/slices/shopSlice';
import { getProductsByShop } from '../redux/slices/productSlice';
import ProductCard from '../components/Products/ProductCard';
import './ShopDetails.css';

const ShopDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentShop, isLoading: shopLoading } = useSelector((state) => state.shops);
  const { products, isLoading: productsLoading } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({
    category: '',
    availability: '',
    search: '',
  });

  useEffect(() => {
    dispatch(getShop(id));
    dispatch(getProductsByShop({ shopId: id, filters: {} }));
  }, [dispatch, id]);

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const activeFilters = {};
    if (filters.search) activeFilters.search = filters.search;
    if (filters.category) activeFilters.category = filters.category;
    if (filters.availability) activeFilters.availability = filters.availability;
    
    dispatch(getProductsByShop({ shopId: id, filters: activeFilters }));
  };

  const handleReset = () => {
    setFilters({
      category: '',
      availability: '',
      search: '',
    });
    dispatch(getProductsByShop({ shopId: id, filters: {} }));
  };

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  // Calculate availability stats
  const availabilityStats = {
    available: products.filter(p => p.availability === 'available').length,
    lowStock: products.filter(p => p.availability === 'low-stock').length,
    outOfStock: products.filter(p => p.availability === 'out-of-stock').length,
  };

  if (shopLoading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentShop) {
    return (
      <div className="container">
        <div className="alert alert-error">Shop not found</div>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="shop-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <span>{currentShop?.name || 'Shop'}</span>
        </nav>

        {/* Shop Info */}
        <div className="shop-info-card">
          <div className="shop-header">
            <div>
              <h1>{currentShop.name}</h1>
              <span className="shop-category-badge">{currentShop.category}</span>
            </div>
          </div>
          
          {currentShop.description && (
            <p className="shop-description">{currentShop.description}</p>
          )}
          
          <div className="shop-details-grid">
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <div>
                <p className="detail-label">Phone</p>
                <p className="detail-value">{currentShop.phone}</p>
              </div>
            </div>
            
            {currentShop.email && (
              <div className="detail-item">
                <span className="detail-icon">✉️</span>
                <div>
                  <p className="detail-label">Email</p>
                  <p className="detail-value">{currentShop.email}</p>
                </div>
              </div>
            )}
            
            {currentShop.address && (
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div>
                  <p className="detail-label">Address</p>
                  <p className="detail-value">
                    {[
                      currentShop.address.street,
                      currentShop.address.village,
                      currentShop.address.city,
                      currentShop.address.state,
                      currentShop.address.pincode
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Product Stats */}
          <div className="product-stats">
            <div className="stat-card available">
              <div className="stat-number">{availabilityStats.available}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-card low-stock">
              <div className="stat-number">{availabilityStats.lowStock}</div>
              <div className="stat-label">Low Stock</div>
            </div>
            <div className="stat-card out-of-stock">
              <div className="stat-number">{availabilityStats.outOfStock}</div>
              <div className="stat-label">Out of Stock</div>
            </div>
            <div className="stat-card total">
              <div className="stat-number">{products.length}</div>
              <div className="stat-label">Total Products</div>
            </div>
          </div>
        </div>

        {/* Search & Filters Section */}
        <div className="products-filter-section">
          <h2>🛍️ Browse Products</h2>
          <p className="section-subtitle">
            Check product availability and prices before you visit
          </p>
          
          <form onSubmit={handleSearch} className="product-search-form">
            <div className="search-row">
              <input
                type="text"
                name="search"
                className="search-input"
                placeholder="Search for products (e.g., rice, milk, soap)..."
                value={filters.search}
                onChange={handleFilterChange}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
            
            <div className="filters-row">
              <select
                name="category"
                className="form-control"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                name="availability"
                className="form-control"
                value={filters.availability}
                onChange={handleFilterChange}
              >
                <option value="">All Availability</option>
                <option value="available">✅ Available</option>
                <option value="low-stock">⚠️ Low Stock</option>
                <option value="out-of-stock">❌ Out of Stock</option>
              </select>
              
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>

          {products.length > 0 && (
            <p className="results-count">
              Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>

        {/* Products List */}
        {productsLoading ? (
          <div className="spinner"></div>
        ) : products.length > 0 ? (
          <div className="grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>
              {filters.search || filters.category || filters.availability
                ? 'Try adjusting your search filters'
                : 'This shop hasn\'t added any products yet'}
            </p>
            {(filters.search || filters.category || filters.availability) && (
              <button onClick={handleReset} className="btn btn-primary">
                View All Products
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetails;

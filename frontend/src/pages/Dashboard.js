import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProductsByShop, getCategorySummary } from '../redux/slices/productSlice';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, categorySummary, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.shop) {
      dispatch(getProductsByShop({ shopId: user.shop, filters: {} }));
      dispatch(getCategorySummary(user.shop));
    }
  }, [user, navigate, dispatch]);

  if (!user) {
    return null;
  }

  const getStatsCard = () => {
    const available = products.filter((p) => p.availability === 'available').length;
    const lowStock = products.filter((p) => p.availability === 'low-stock').length;
    const outOfStock = products.filter((p) => p.availability === 'out-of-stock').length;
    const revenue = products.reduce((acc, p) => acc + (p.price * p.sold || 0), 0).toFixed(2);

    return (
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <h3>{products.length}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card stat-available">
          <h3>{available}</h3>
          <p>Available</p>
        </div>
        <div className="stat-card stat-low">
          <h3>{lowStock}</h3>
          <p>Low Stock</p>
        </div>
        <div className="stat-card stat-out">
          <h3>{outOfStock}</h3>
          <p>Out of Stock</p>
        </div>
        <div className="stat-card stat-revenue">
          <h3>${revenue}</h3>
          <p>Total Revenue</p>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>📊 Dashboard</h1>
          <p className="welcome-text">
            Welcome, <strong>{user.name}</strong> ({user.role})
          </p>
        </div>

        {user.role === 'customer' ? (
          <div className="customer-dashboard">
            <div className="info-card">
              <h2>Welcome to NearByStock!</h2>
              <p>Browse shops and check product availability in your area.</p>
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Browse Shops
              </button>
            </div>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                {/* Statistics */}
                <section className="dashboard-section">
                  <h2>Inventory Overview</h2>
                  {getStatsCard()}
                </section>

                {/* Category Summary */}
                {categorySummary.length > 0 && (
                  <section className="dashboard-section">
                    <h2>Category Summary</h2>
                    <div className="category-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Total</th>
                            <th>Available</th>
                            <th>Low Stock</th>
                            <th>Out of Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categorySummary.map((cat) => (
                            <tr key={cat._id}>
                              <td><strong>{cat._id}</strong></td>
                              <td>{cat.totalProducts}</td>
                              <td className="text-success">{cat.available}</td>
                              <td className="text-warning">{cat.lowStock}</td>
                              <td className="text-danger">{cat.outOfStock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Add/Edit Shop Details */}
                <section className="dashboard-section">
                  <h2>Manage Shop Details</h2>
                  <form className="shop-form">
                    <div className="form-group">
                      <label htmlFor="shopName">Shop Name</label>
                      <input
                        type="text"
                        id="shopName"
                        name="shopName"
                        className="form-control"
                        placeholder="Enter shop name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="shopImage">Shop Image</label>
                      <input
                        type="file"
                        id="shopImage"
                        name="shopImage"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="shopAddress">Shop Address</label>
                      <textarea
                        id="shopAddress"
                        name="shopAddress"
                        className="form-control"
                        placeholder="Enter shop address"
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </form>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

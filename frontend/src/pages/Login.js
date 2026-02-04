import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../redux/slices/authSlice';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer',
    shop: '',
    shopName: '',
  });

  const { email, password, userType, shop, shopName } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !userType || (userType === 'worker' && !shop) || (userType === 'owner' && !shopName)) {
      alert('Please fill in all fields');
      return;
    }

    dispatch(login({ email, password, userType, shop, shopName }));
  };

  return (
    <div className="auth-page fade-in" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '18px' }}>
      <div className="auth-container slide-in">
        <div className="auth-card zoom-in">
          <h2 className="auth-title">🔐 Login to NearByStock</h2>
          <p className="auth-subtitle">Access your shop inventory</p>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="userType">User Type</label>
              <select
                id="userType"
                name="userType"
                className="form-control"
                value={userType}
                onChange={onChange}
                required
              >
                <option value="customer">Customer</option>
                <option value="owner">Shop Owner</option>
                <option value="worker">Worker</option>
              </select>
            </div>

            {userType === 'worker' && (
              <div className="form-group">
                <label htmlFor="shop">Select Shop</label>
                <select
                  id="shop"
                  name="shop"
                  className="form-control"
                  value={shop}
                  onChange={onChange}
                  required
                >
                  <option value="">Select a shop</option>
                  {/* Replace with dynamic shop options */}
                  <option value="shop1">Shop 1</option>
                  <option value="shop2">Shop 2</option>
                </select>
              </div>
            )}

            {userType === 'owner' && (
              <div className="form-group">
                <label htmlFor="shopName">Shop Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="shopName"
                  name="shopName"
                  value={shopName}
                  onChange={onChange}
                  placeholder="Enter your shop name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

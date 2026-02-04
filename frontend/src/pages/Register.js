import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../redux/slices/authSlice';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'customer',
    phone: '',
    shopName: '',
    shopAddress: '',
    shopImage: '',
  });

  const { name, email, password, password2, role, phone, shopName, shopAddress, shopImage } = formData;

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

    if (!name || !email || !password) {
      alert('Please fill in all required fields');
      return;
    }

    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }

    if (role === 'owner' && (!shopName || !shopImage)) {
      alert('Shop name and image are required for shop owners');
      return;
    }

    const formDataWithImage = new FormData();
    formDataWithImage.append('name', name);
    formDataWithImage.append('email', email);
    formDataWithImage.append('password', password);
    formDataWithImage.append('role', role);
    formDataWithImage.append('phone', phone);
    formDataWithImage.append('shopName', shopName);
    formDataWithImage.append('shopAddress', shopAddress);
    formDataWithImage.append('shopImage', shopImage);

    dispatch(register(formDataWithImage));
  };

  return (
    <div className="auth-page fade-in" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '18px' }}>
      <div className="auth-container slide-in">
        <div className="auth-card zoom-in">
          <h2 className="auth-title">🔐 Register on NearByStock</h2>
          <p className="auth-subtitle">Join our community</p>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
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
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={phone}
                onChange={onChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Register as *</label>
              <select
                className="form-control"
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                required
              >
                <option value="customer">Customer (Browse only)</option>
                <option value="owner">Shop Owner (Manage inventory)</option>
                <option value="worker">Worker (Update stock)</option>
              </select>
            </div>

            {role === 'owner' && (
              <>
                <div className="form-group">
                  <label htmlFor="shopName">Shop Name *</label>
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

                <div className="form-group">
                  <label htmlFor="shopAddress">Shop Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="shopAddress"
                    name="shopAddress"
                    value={shopAddress}
                    onChange={onChange}
                    placeholder="Enter shop address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shopImage">Shop Image</label>
                  <input
                    type="file"
                    id="shopImage"
                    name="shopImage"
                    className="form-control"
                    onChange={(e) => setFormData({ ...formData, shopImage: e.target.files[0] })}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="password">Password *</label>
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

            <div className="form-group">
              <label htmlFor="password2">Confirm Password *</label>
              <input
                type="password"
                className="form-control"
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

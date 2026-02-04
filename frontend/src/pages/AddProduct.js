import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../redux/slices/productSlice';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const editProduct = location.state?.product;
  const isEditMode = !!editProduct;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: 0,
    unit: 'pcs',
    price: '',
    lowStockThreshold: 10,
    barcode: '',
  });

  useEffect(() => {
    if (!user || (user.role !== 'owner' && user.role !== 'worker')) {
      navigate('/login');
    }

    if (isEditMode) {
      setFormData({
        name: editProduct.name || '',
        category: editProduct.category || '',
        description: editProduct.description || '',
        quantity: editProduct.quantity || 0,
        unit: editProduct.unit || 'pcs',
        price: editProduct.price || '',
        lowStockThreshold: editProduct.lowStockThreshold || 10,
        barcode: editProduct.barcode || '',
      });
    }
  }, [user, navigate, isEditMode, editProduct]);

  const { name, category, description, quantity, unit, price, lowStockThreshold, barcode } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category) {
      alert('Please fill in required fields');
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id: editProduct._id, productData: formData })).unwrap();
        alert('Product updated successfully!');
      } else {
        await dispatch(createProduct(formData)).unwrap();
        alert('Product added successfully!');
      }
      navigate('/products');
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="add-product-page">
      <div className="container">
        <div className="form-container">
          <h1>{isEditMode ? '✏️ Edit Product' : '➕ Add New Product'}</h1>

          <form onSubmit={onSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={category}
                  onChange={onChange}
                  placeholder="e.g., Groceries, Electronics"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                placeholder="Enter product description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={onChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <input
                  type="text"
                  className="form-control"
                  id="unit"
                  name="unit"
                  value={unit}
                  onChange={onChange}
                  placeholder="pcs, kg, ltr"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={price}
                  onChange={onChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
                <input
                  type="number"
                  className="form-control"
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  value={lowStockThreshold}
                  onChange={onChange}
                  min="0"
                />
                <small className="form-text">Alert when quantity falls below this value</small>
              </div>

              <div className="form-group">
                <label htmlFor="barcode">Barcode (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  id="barcode"
                  name="barcode"
                  value={barcode}
                  onChange={onChange}
                  placeholder="Enter barcode"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {isEditMode ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

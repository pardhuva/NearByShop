import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProductsByShop, deleteProduct } from '../redux/slices/productSlice';
import ProductCard from '../components/Products/ProductCard';
import './ProductList.css';

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.shop) {
      dispatch(getProductsByShop({ shopId: user.shop, filters: {} }));
    }
  }, [user, navigate, dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
      dispatch(getProductsByShop({ shopId: user.shop, filters: {} }));
    }
  };

  const handleUpdate = (product) => {
    // Navigate to add-product with edit mode
    navigate('/add-product', { state: { product } });
  };

  if (!user || (user.role !== 'owner' && user.role !== 'worker')) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Access denied. This page is only for shop owners and workers.
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <div className="container">
        <div className="page-header">
          <h1>📦 Your Products</h1>
          <button
            onClick={() => navigate('/add-product')}
            className="btn btn-primary"
          >
            ➕ Add New Product
          </button>
        </div>

        {isLoading ? (
          <div className="spinner"></div>
        ) : products.length > 0 ? (
          <div className="grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                userRole={user.role}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No products yet. Add your first product!</p>
            <button
              onClick={() => navigate('/add-product')}
              className="btn btn-primary"
            >
              Add Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

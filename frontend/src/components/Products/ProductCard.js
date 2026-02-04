import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onUpdate, onDelete, userRole }) => {
  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'available':
        return <span className="badge badge-available">✓ Available</span>;
      case 'low-stock':
        return <span className="badge badge-low-stock">⚠ Low Stock</span>;
      case 'out-of-stock':
        return <span className="badge badge-out-of-stock">✗ Out of Stock</span>;
      default:
        return null;
    }
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <h3 className="product-name">{product.name}</h3>
        {getAvailabilityBadge(product.availability)}
      </div>
      
      <div className="product-body">
        <p className="product-category">
          <strong>Category:</strong> {product.category}
        </p>
        
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-details">
          <p>
            <strong>Quantity:</strong> {product.quantity} {product.unit}
          </p>
          {product.price && (
            <p>
              <strong>Price:</strong> ₹{product.price}
            </p>
          )}
        </div>

        {product.lastUpdatedBy && (
          <p className="product-updated">
            <small>Updated by: {product.lastUpdatedBy.name}</small>
          </p>
        )}
      </div>

      {(userRole === 'owner' || userRole === 'worker') && (
        <div className="product-actions">
          {onUpdate && (
            <button 
              onClick={() => onUpdate(product)} 
              className="btn btn-secondary btn-sm"
            >
              Update
            </button>
          )}
          {onDelete && userRole === 'owner' && (
            <button 
              onClick={() => onDelete(product._id)} 
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;

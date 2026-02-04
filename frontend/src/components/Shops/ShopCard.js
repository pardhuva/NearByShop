import React from 'react';
import { Link } from 'react-router-dom';
import './ShopCard.css';

const ShopCard = ({ shop }) => {
  return (
    <div className="shop-card">
      <div className="shop-header">
        <h3 className="shop-name">{shop.name}</h3>
        <span className="shop-category">{shop.category}</span>
      </div>

      <div className="shop-body">
        {shop.description && (
          <p className="shop-description">{shop.description}</p>
        )}

        <div className="shop-details">
          <p>
            <strong>📞 Phone:</strong> {shop.phone}
          </p>
          {shop.address && (
            <p>
              <strong>📍 Address:</strong>{' '}
              {[
                shop.address.village,
                shop.address.city,
                shop.address.state
              ].filter(Boolean).join(', ')}
            </p>
          )}
          {shop.owner && (
            <p>
              <strong>👤 Owner:</strong> {shop.owner.name}
            </p>
          )}
        </div>
      </div>

      <div className="shop-map">
        {shop.location && (
          <iframe
            src={`https://www.google.com/maps?q=${shop.location.lat},${shop.location.lng}&z=15&output=embed`}
            title="Shop Location"
            className="shop-map-iframe"
            allowFullScreen
          ></iframe>
        )}
      </div>

      <div className="shop-actions">
        <Link to={`/shop/${shop._id}`} className="btn btn-primary">
          View Products
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;

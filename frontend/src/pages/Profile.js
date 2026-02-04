import React from 'react';
import { useSelector } from 'react-redux';
import './Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <p>You need to log in to view your profile.</p>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>👤 Your Profile</h1>
        <div className="profile-card">
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.role === 'owner' && user.shop && (
            <p><strong>Shop:</strong> {user.shop.name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
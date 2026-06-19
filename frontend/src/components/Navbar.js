import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <h2>DS Properties</h2>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">({user?.role})</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
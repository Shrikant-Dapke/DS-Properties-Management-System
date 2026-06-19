import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h3>DS Properties</h3>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <Link to="/dashboard">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li className={isActive('/customers') ? 'active' : ''}>
            <Link to="/customers">
              <i className="fas fa-users"></i>
              <span>Customers</span>
            </Link>
          </li>
          
          <li className={isActive('/plots') ? 'active' : ''}>
            <Link to="/plots">
              <i className="fas fa-map"></i>
              <span>Plots</span>
            </Link>
          </li>
          
          <li className={isActive('/income') ? 'active' : ''}>
            <Link to="/income">
              <i className="fas fa-money-bill-wave"></i>
              <span>Income</span>
            </Link>
          </li>
          
          <li className={isActive('/expenses') ? 'active' : ''}>
            <Link to="/expenses">
              <i className="fas fa-receipt"></i>
              <span>Expenses</span>
            </Link>
          </li>
          
          <li className={isActive('/reports') ? 'active' : ''}>
            <Link to="/reports">
              <i className="fas fa-chart-bar"></i>
              <span>Reports</span>
            </Link>
          </li>
          
          <li className={isActive('/settings') ? 'active' : ''}>
            <Link to="/settings">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
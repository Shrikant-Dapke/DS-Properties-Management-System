import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Plots from './pages/Plots';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <div className="main-layout">
                  <Sidebar />
                  <div className="content-area">
                    <Navbar />
                    <div className="main-content">
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="customers/*" element={<Customers />} />
                        <Route path="plots/*" element={<Plots />} />
                        <Route path="income/*" element={<Income />} />
                        <Route path="expenses/*" element={<Expenses />} />
                        <Route path="reports/*" element={<Reports />} />
                        <Route path="settings/*" element={<Settings />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            } />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
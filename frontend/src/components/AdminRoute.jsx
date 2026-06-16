import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  const user = userStr ? JSON.parse(userStr) : null;

  // Cek apakah belum login sama sekali ATAU tidak punya izin akses kelas Admin
  if (!user || user.role !== 'Admin' || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

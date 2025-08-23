import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const token = localStorage.getItem('token'); // check token

  if (!token) {
    return <Navigate to="/login" replace />; // redirect if not logged in
  }

  return (
    <div>
      {/* optional: shared layout for all admin pages */}
      <Outlet /> {/* this renders Admin and all nested routes */}
    </div>
  );
};

export default AdminLayout;
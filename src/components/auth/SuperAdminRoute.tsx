import React from 'react';
import { useAuthStore } from '../../store/auth.store';
import { Navigate, Outlet } from 'react-router-dom';

export const SuperAdminRoute: React.FC = () => {
  const { role, isAuthenticated } = useAuthStore();

  // 1. Si está cargando o no está autenticado, lo saca
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si está autenticado PERO no es Super Admin, lo saca al dashboard normal
  if (role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // 3. Si es Super Admin, lo deja pasar
  return <Outlet />;
};
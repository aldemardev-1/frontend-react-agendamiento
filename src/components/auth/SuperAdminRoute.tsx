import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export const SuperAdminRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 1. Si no está logueado -> Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si está logueado pero NO es Super Admin -> Dashboard normal
  if (user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Si es el Jefe -> Adelante
  return <Outlet />;
};
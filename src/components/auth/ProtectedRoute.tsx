// frontend/src/components/auth/ProtectedRoute.tsx
import { useAuthStore } from '../../store/auth.store';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // 'replace' evita que el usuario pueda volver atrás con el botón del navegador
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el componente "hijo" (que será nuestro DashboardLayout)
  return <Outlet />;
};
// frontend/src/pages/Root.tsx
import { useAuthStore } from '../store/auth.store';
import { Navigate } from 'react-router-dom';

export const Root = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};
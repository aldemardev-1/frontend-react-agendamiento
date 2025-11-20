import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Definir los roles permitidos explícitamente
type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'EMPLOYEE';

interface AuthState {
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      role: null,
      isAuthenticated: false,

      setToken: (token: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          set({
            token,
            // CORRECCIÓN: Forzamos el tipo aquí
            role: (decoded.role as UserRole) || 'OWNER',
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Token inválido:", error);
          set({
            token: null,
            role: null,
            isAuthenticated: false,
          });
        }
      },

      logout: () => {
        set({
          token: null,
          role: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
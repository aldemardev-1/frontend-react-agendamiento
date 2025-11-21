import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

// Definir roles
type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'EMPLOYEE';

// 1. CORRECCIÓN: Agregar businessName a la interfaz User
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessName?: string; // <-- ¡Agregado! (Opcional porque el SuperAdmin quizás no tenga)
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  businessName?: string; // Asegúrate de que tu token traiga esto
  iat: number;
  exp: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,

      setToken: (token: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          
          const user: User = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: (decoded.role as UserRole) || 'OWNER',
            businessName: decoded.name, // Usamos el nombre como businessName por ahora
          };

          set({
            token,
            user,
            role: user.role,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Token inválido:", error);
          set({ token: null, user: null, role: null, isAuthenticated: false });
        }
      },

      logout: () => {
        set({ token: null, user: null, role: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' },
  ),
);
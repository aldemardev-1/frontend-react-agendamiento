import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

// 1. Definimos la interfaz del Usuario
export interface User {
  id: string;
  email: string;
  name: string; // Aquí guardaremos el businessName
  role: UserRole;
}

interface JwtPayload {
  sub: string;  // ID del usuario
  email: string;
  role: string;
  name: string; // El backend ahora envía esto
  iat: number;
  exp: number;
}

type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'EMPLOYEE';

interface AuthState {
  token: string | null;
  user: User | null; // <-- 2. Agregamos el objeto user al estado
  role: UserRole | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null, // Inicialmente null
      role: null,
      isAuthenticated: false,

      setToken: (token: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          
          // 3. Construimos el objeto usuario desde el token
          const user: User = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: (decoded.role as UserRole) || 'OWNER',
          };

          set({
            token,
            user, // Guardamos el usuario completo
            role: user.role,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Token inválido:", error);
          set({
            token: null,
            user: null,
            role: null,
            isAuthenticated: false,
          });
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode'; // <-- 1. IMPORTAR

// 2. Definir el tipo del Payload del Token
interface JwtPayload {
  sub: string;
  email: string;
  role: string; // "OWNER" o "SUPER_ADMIN"
  iat: number;
  exp: number;
}

// 3. Definir el estado del store
interface AuthState {
  token: string | null;
  role: 'OWNER' | 'SUPER_ADMIN' | 'EMPLOYEE' | null; // <-- 4. AÑADIR ROL
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      role: null, // <-- 5. ESTADO INICIAL
      isAuthenticated: false,

      setToken: (token: string) => {
        try {
          // 6. Decodificar el token para extraer el ROL
          const decoded = jwtDecode<JwtPayload>(token);
          
          set({
            token,
            role: decoded.role || 'OWNER', // Guardar el rol
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
          role: null, // <-- 7. LIMPIAR ROL
          isAuthenticated: false,
        });
        // 'persist' se encarga de limpiar localStorage
      },
    }),
    {
      name: 'auth-storage', // Nombre del item en localStorage
      // (Opcional) Solo persistir el token, no el resto
      // partialize: (state) => ({ token: state.token }), 
    },
  ),
);
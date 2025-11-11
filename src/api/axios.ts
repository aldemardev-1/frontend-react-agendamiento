// frontend/src/api/axios.ts
import axios from 'axios';
import { useAuthStore } from '../store/auth.store'; 

const api = axios.create({
  baseURL: 'http://localhost:3001', 
});

// Interceptor de Petición (Request)
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- ¡INTERCEPTOR DE RESPUESTA! ---
// Interceptor de Respuesta (Response)
api.interceptors.response.use(
  // 1. Si la respuesta es exitosa (2xx), solo devuélvela
  (response) => {
    return response;
  },
  // 2. Si la respuesta falla...
  (error) => {
    // 3. Revisa si el error es 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // 4. Llama a la acción de logout de Zustand
      useAuthStore.getState().logout();

      // 5. Redirige al login
      // (Usamos window.location porque estamos fuera de React Router)
      window.location.href = '/login'; 

      // (Opcional) Mostrar un mensaje
      alert('Tu sesión ha expirado, por favor inicia sesión de nuevo.');
    }

    // 6. Devuelve el error para que TanStack Query (onError) pueda manejarlo
    return Promise.reject(error);
  }
);

export default api;
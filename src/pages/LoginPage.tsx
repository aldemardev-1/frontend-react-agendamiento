import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/auth.store'; // <-- 1. Importar nuestro store
import { AxiosError } from 'axios'; // Para un mejor tipado de errores

// El DTO del backend solo espera email y password
interface LoginData {
  email: string;
  password: string;
}

// La respuesta de la API (con el token)
interface LoginResponse {
  message: string;
  accessToken: string;
}

// La función que hace la llamada a la API
const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: loginUser,

    // <-- 2. ¡El paso clave!
    onSuccess: (data) => {
      // 'data.accessToken' es el token que nos dio el backend
      setToken(data.accessToken);

      // Limpiar errores al tener éxito
      setErrorMsg('');

      // --- 3. Redirección Inteligente ---
      // Leemos el 'role' del store DESPUÉS de que se actualizó
      const userRole = useAuthStore.getState().role;

      if (userRole === 'SUPER_ADMIN') {
        navigate('/admin'); // Redirigir al Super Admin a su panel
      } else {
        navigate('/dashboard'); // Redirigir al Owner a su panel
      }
    },
    onError: (error: AxiosError) => {
      console.error('Error en el login:', error);
      // Extraer el mensaje de error de la respuesta de NestJS
      const apiError = error.response?.data as { message?: string | string[] };
      let message = 'Error desconocido al iniciar sesión.';
      
      if (typeof apiError?.message === 'string') {
        message = apiError.message;
      } else if (Array.isArray(apiError?.message)) {
        message = apiError.message.join(', ');
      }
      
      setErrorMsg(message);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
          >
            {mutation.isPending ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

          {/* Mostrar el error del estado */}
          {errorMsg && (
            <p className="text-red-500 text-xs italic mt-4 text-center">
              {errorMsg}
            </p>
          )}
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
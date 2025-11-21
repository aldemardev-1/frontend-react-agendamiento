import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/auth.store';
import { 
  BuildingStorefrontIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

interface RegisterData {
  email: string;
  password: string;
  businessName: string;
}

const registerUser = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para el ojito
  
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // --- AUTO LOGIN ---
      // Si el backend devuelve el token al registrarse, lo guardamos y entramos.
      if (data.accessToken) {
        setToken(data.accessToken);
        navigate('/dashboard');
      } else {
        // Si no, lo mandamos al login normal
        navigate('/login');
      }
    },
    onError: (error: any) => {
      console.error('Error en registro:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password, businessName });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/60 relative overflow-hidden">
        
        {/* Decoración superior */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Crea tu Cuenta
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Comienza a gestionar tu negocio profesionalmente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nombre del Negocio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
              Nombre del Negocio
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="Ej: Barbería El Rey"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
              Correo Electrónico
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password con Ojito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1} // Para que no estorbe al tabulador
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {mutation.isPending ? 'Creando tu espacio...' : 'Crear Cuenta Gratis'}
          </button>

          {mutation.isError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs text-center border border-red-100 font-medium animate-pulse">
              {/* CORRECCIÓN TS: Casteamos a 'any' para leer la respuesta del error */}
              {(mutation.error as any).response?.data?.message || 
               (mutation.error as Error).message || 
               'Error al registrarse'}
            </div>
          )}
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Inicia Sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
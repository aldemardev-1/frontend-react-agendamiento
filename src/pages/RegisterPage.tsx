// frontend/src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';

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

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('¡Usuario registrado!', data);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      // Una vez tengamos la página de login, redirigimos aquí:
      // navigate('/login'); 
      // Por ahora, recargamos para que el usuario pueda registrar otro si quiere
      window.location.reload(); 
    },
    onError: (error: any) => {
      console.error('Error en el registro:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      alert(`Error al registrarse: ${errorMessage}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password, businessName });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Crear Cuenta para tu Negocio
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="businessName" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del Negocio:
            </label>
            <input
              type="text"
              id="businessName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email de Administrador:
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
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña (mín. 8 caracteres):
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {mutation.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          {mutation.isError && (
            <p className="text-red-500 text-xs italic mt-4 text-center">
              Error: {mutation.error.response?.data?.message || mutation.error.message}
            </p>
          )}
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Inicia Sesion aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
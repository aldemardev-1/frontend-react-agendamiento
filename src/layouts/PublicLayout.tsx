import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Reserva tu Cita
          </h1>
        </header>
        <main className="bg-white p-6 md:p-10 rounded-2xl shadow-xl">
          {/* Aquí se renderizará la página de reserva */}
          <Outlet />
        </main>
        <footer className="text-center mt-6 text-gray-500 text-sm">
          Powered by Tu Agenda App
        </footer>
      </div>
    </div>
  );
};

export default PublicLayout;

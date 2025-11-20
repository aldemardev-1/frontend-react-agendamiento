import React from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import ProximasCitasList from '../components/dashboard/ProximasCitasList';
import NuevosClientesList from '../components/dashboard/NuevosClientesList';
// Importamos el nuevo componente
import BookingLinkCard from '../components/dashboard/BookingLinkCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-2 md:p-4"> 
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Bienvenido a tu Dashboard
      </h2>

      {/* --- NUEVO: Tarjeta del Link de Reservas --- */}
      {/* La colocamos aquí para máxima visibilidad */}
      <BookingLinkCard />

      {/* --- Sección de Estadísticas --- */}
      <div className="mb-8">
        <DashboardStats />
      </div>

      {/* --- Sección de Listas (2 columnas) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna más ancha para Próximas Citas */}
        <div className="lg:col-span-2">
          <ProximasCitasList />
        </div>

        {/* Columna para Nuevos Clientes */}
        <div className="lg:col-span-1">
          <NuevosClientesList />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
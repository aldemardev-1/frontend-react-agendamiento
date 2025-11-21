import BookingLinkCard from '@/components/dashboard/BookingLinkCard';
import DashboardStats from '@/components/dashboard/DashboardStats';
import FinancialStats from '@/components/dashboard/FinancialStats';
import ProximasCitasList from '@/components/dashboard/ProximasCitasList';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { useReports } from '@/hooks/useReports';
import { useAuthStore } from '@/store/auth.store';
import React from 'react';


const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  // 1. Llamamos al hook de reportes
  const { data: reportsData, isLoading } = useReports();

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* --- Encabezado --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Hola, {user?.name || 'Bienvenido'} 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Aquí tienes el resumen financiero y operativo de tu negocio.
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
            {new Date().toLocaleDateString('es-ES', { dateStyle: 'full' })}
          </p>
        </div>
      </div>

      {/* --- 1. Link de Reservas (Lo más importante para compartir) --- */}
      <BookingLinkCard />

      {/* --- 2. Sección Financiera (El dinero) --- */}
      <FinancialStats 
        income={reportsData?.income.current || 0} 
        growth={reportsData?.income.growth || 0} 
        isLoading={isLoading} 
      />

      {/* --- 3. Grid Principal --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda (Ancha): Gráfica de Ingresos */}
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart 
            data={reportsData?.chartData || []} 
            isLoading={isLoading} 
          />
          
          {/* Tus stats generales de clientes/empleados abajo de la gráfica */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen Operativo</h3>
            <DashboardStats />
          </div>
        </div>

        {/* Columna Derecha (Estrecha): Próximas Citas */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
             <ProximasCitasList />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
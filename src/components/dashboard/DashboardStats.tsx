import React from 'react';
// --- ¡CORRECCIÓN! Añadiendo .ts a las rutas ---
import { useClientes } from '../../hooks/useClients.ts';
import { useServices } from '../../hooks/useServices.ts';
import { useEmployees } from '../../hooks/useEmployees.ts';
import { Users, Briefcase, UserPlus } from 'lucide-react';

// Un componente interno para cada tarjeta
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6">
      <div className={`rounded-full p-4 ${color}`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

// Componente principal
const DashboardStats: React.FC = () => {
  // Usamos los hooks solo para obtener el total de items
  // Pedimos limit=1 para no traer data innecesaria, solo el 'meta'
  const { data: clientesData } = useClientes();
  const { data: servicesData } = useServices();
  const { data: employeesData } = useEmployees();
  // Nota: Para "Total Citas", 'useCitas' filtra por fecha. 
  // Para un total real, necesitaríamos un endpoint de 'stats' o ajustar el hook.
  // Por ahora, usaremos los clientes, servicios y empleados.

  const totalClientes = clientesData?.meta.totalItems || 0;
  const totalServicios = servicesData?.meta.totalItems || 0;
  const totalEmpleados = employeesData?.meta.totalItems || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Clientes"
        value={totalClientes}
        icon={Users}
        color="bg-blue-500"
      />
      <StatCard
        title="Total Empleados"
        value={totalEmpleados}
        icon={UserPlus}
        color="bg-green-500"
      />
      <StatCard
        title="Total Servicios"
        value={totalServicios}
        icon={Briefcase}
        color="bg-indigo-500"
      />
      {/* Podríamos añadir "Total Citas del Mes" si 'useCitas' lo permitiera.
        <StatCard
          title="Citas (Mes)"
          value={citasData?.meta.totalItems || 0}
          icon={Calendar}
          color="bg-red-500"
        /> 
      */}
    </div>
  );
};

export default DashboardStats;


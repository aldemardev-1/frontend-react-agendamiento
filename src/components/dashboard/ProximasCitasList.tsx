import React, { useMemo } from 'react'; // IMPORTANTE: useMemo
import { useCitas } from '../../hooks/useCitas';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProximasCitasList: React.FC = () => {
  // --- ARREGLO DEL BUCLE ---
  // Memorizamos la fecha para que no cambie en cada renderizado (milisegundos)
  const startDate = useMemo(() => new Date().toISOString(), []);

  const { data: citasData, isLoading, isError } = useCitas({
    startDate: startDate, 
    initialLimit: 5,
  });

  if (isLoading) return <div className="p-4 text-gray-500">Cargando citas...</div>;
  if (isError) return <div className="p-4 text-red-500">Error al cargar las citas.</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-5">Próximas Citas</h3>

      {citasData?.data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
           <p>No tienes citas programadas.</p>
        </div>
      )}

      {citasData && citasData.data.length > 0 && (
        <div className="space-y-4">
          {citasData.data.map((cita) => (
            <div
              key={cita.id}
              className="border border-gray-100 rounded-lg p-4 transition-all hover:shadow-md hover:bg-blue-50/20"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-blue-600 capitalize">
                  {format(new Date(cita.startTime), 'eeee dd MMM', { locale: es })}
                </p>
                <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                  {format(new Date(cita.startTime), 'p', { locale: es })}
                </span>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {cita.cliente?.name || 'Cliente desconocido'}
              </h4>
              
              <div className="text-sm text-gray-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{cita.service?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{cita.employee?.name}</span>
                </div>
              </div>
            </div>
          ))}
          <Link 
            to="/dashboard/calendario"
            className="block text-center text-blue-600 font-medium pt-4 hover:underline text-sm"
          >
            Ver calendario completo →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProximasCitasList;
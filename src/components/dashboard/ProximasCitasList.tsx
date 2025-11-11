import React from 'react';
import { useCitas } from '../../hooks/useCitas';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { User, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProximasCitasList: React.FC = () => {
  // Pedir citas desde hoy, sin límite de fin, y solo las 5 primeras
  const { data: citasData, isLoading, isError } = useCitas({
    startDate: new Date().toISOString(),
    initialLimit: 5,
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-5">Próximas Citas</h3>
      {isLoading && <p className="text-gray-500">Cargando citas...</p>}
      {isError && <p className="text-red-500">Error al cargar las citas.</p>}

      {citasData?.data.length === 0 && (
        <p className="text-gray-500 text-center py-6">
          No tienes citas programadas.
        </p>
      )}

      {citasData && citasData.data.length > 0 && (
        <div className="space-y-4">
          {citasData.data.map((cita) => (
            <div
              key={cita.id}
              className="border border-gray-100 rounded-lg p-4 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-blue-600 capitalize">
                  {format(new Date(cita.startTime), 'eeee dd MMM', { locale: es })}
                </p>
                <p className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                  {format(new Date(cita.startTime), 'p', { locale: es })}
                </p>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {cita.cliente?.name || 'Cliente no econtrado'}
              </h4>
              
              <div className="text-sm text-gray-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{cita.service?.name || 'Servicio no econtrado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{cita.employee?.name || 'Empleado no econtrado'}</span>
                </div>
              </div>
            </div>
          ))}
          <Link 
            to="/dashboard/calendario"
            className="block text-center text-blue-600 font-medium pt-4 hover:underline"
          >
            Ver calendario completo
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProximasCitasList;

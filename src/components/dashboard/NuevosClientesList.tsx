import React from 'react';
import { useClientes } from '../../hooks/useClients';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const NuevosClientesList: React.FC = () => {
  // Pedir solo la primera página de 5 clientes
  const { data: clientesData, isLoading, isError } = useClientes();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-5">Nuevos Clientes</h3>
      {isLoading && <p className="text-gray-500">Cargando clientes...</p>}
      {isError && <p className="text-red-500">Error al cargar los clientes.</p>}

      {clientesData?.data.length === 0 && (
        <p className="text-gray-500 text-center py-6">
          Aún no tienes clientes registrados.
        </p>
      )}

      {clientesData && clientesData.data.length > 0 && (
        <div className="space-y-3">
          {clientesData.data.map((cliente) => (
            <div
              key={cliente.id}
              className="flex items-center gap-4 border-b border-gray-100 pb-3 last:border-b-0"
            >
              <div className="bg-gray-100 p-3 rounded-full">
                <UserPlus className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {cliente.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {cliente.email || 'Sin email'}
                </p>
              </div>
            </div>
          ))}
          <Link 
            to="/dashboard/clientes"
            className="block text-center text-blue-600 font-medium pt-4 hover:underline"
          >
            Ver todos los clientes
          </Link>
        </div>
      )}
    </div>
  );
};

export default NuevosClientesList;

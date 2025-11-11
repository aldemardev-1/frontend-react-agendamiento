import React from 'react';
import { useAdminBusinesses } from '../hooks/useAdminBusinesses';
import { useUpdatePlan } from '../hooks/useUpdatePlan';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { type UpdatePlanDto } from '../api/admin.api'; // <-- 1. IMPORTAR TIPO

export const AdminBusinessesPage: React.FC = () => {
  const { 
    data, 
    isLoading, 
    isError, 
    search, 
    setSearch, 
    page, 
    setPage,
    refetch, // <-- Ahora sí existen
    isRefetching // <-- Ahora sí existen
  } = useAdminBusinesses();
    
  const updatePlanMutation = useUpdatePlan();

  // 2. Usar el tipo importado
  const handlePlanChange = (userId: string, newPlan: UpdatePlanDto['plan']) => {
    if (window.confirm(`¿Seguro que quieres cambiar este usuario al plan ${newPlan}?`)) {
      updatePlanMutation.mutate({ 
        userId, 
        plan: newPlan // <-- 3. Ya no necesita 'as any'
      });
    }
  };

  const formatExpiryDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return <span className="text-gray-400">—</span>;
    }
    const date = new Date(dateString);
    // Comprobar si la fecha es en el pasado (sumar 1 día para gracia)
    const isPast = date < new Date(Date.now() - 86400000); 
    return (
      <span className={isPast ? 'font-bold text-red-500' : 'text-gray-700'}>
        {format(date, 'dd MMM, yyyy', { locale: es })}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestionar Negocios
        </h1>
        <button
          onClick={() => refetch()}
          disabled={isRefetching || isLoading}
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Input de Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre de negocio o email..."
          className="w-full md:w-1/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de Negocios */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {isLoading && (
          <div className="flex justify-center items-center gap-2 p-6">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-gray-600">Cargando negocios...</span>
          </div>
        )}
        {isError && (
          <div className="flex justify-center items-center gap-2 p-6 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Error al cargar datos.</span>
          </div>
        )}
        {data && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Negocio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicios</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron negocios.
                  </td>
                </tr>
              )}
              {data.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.businessName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.plan === 'PROFESIONAL' ? 'bg-green-100 text-green-800' :
                      user.plan === 'EMPRESA' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* ¡AHORA SÍ FUNCIONA! */}
                    {formatExpiryDate(user.planExpiresAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user._count.employees} / {user.maxEmployees}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user._count.services} / {user.maxServices}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {user.plan === 'GRATIS' ? (
                      <button
                        onClick={() => handlePlanChange(user.id, 'PROFESIONAL')}
                        disabled={updatePlanMutation.isPending}
                        className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                      >
                        Activar Profesional
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlanChange(user.id, 'GRATIS')}
                        disabled={updatePlanMutation.isPending}
                        className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                      >
                        Revertir a Gratis
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Paginación */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Página {data.meta.currentPage} de {data.meta.totalPages} (Total: {data.meta.totalItems} negocios)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.meta.totalPages}
              className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBusinessesPage;
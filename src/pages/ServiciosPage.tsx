// frontend/src/pages/ServiciosPage.tsx
import React, { useState } from 'react';
import { useServices } from '../hooks/useServices';
import { useCreateService } from '../hooks/useCreateService';
import { useDeleteService } from '../hooks/useDeleteService';
import { useUpdateService } from '../hooks/useUpdateService';
import type { CreateServiceDto, Service } from '../types/service.types';
import ServiceFormModal from '../components/services/ServiceFormModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const ServiciosPage: React.FC = () => {
  // --- Hooks de "Leer" ---
  const { 
    data, 
    isLoading: isLoadingServices, 
    isError, 
    error, 
    page, 
    setPage, 
    search, 
    setSearch 
  } = useServices();

  // --- Estados de los Modales ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null); 

  // --- Hooks de Mutación ---
  const createServiceMutation = useCreateService();
  const deleteServiceMutation = useDeleteService();
  const updateServiceMutation = useUpdateService();

  // --- Lógica de "Eliminar" ---
  const handleDeleteService = () => {
    if (serviceToDelete) { // Corregido de serviceToEdit a serviceToDelete
      deleteServiceMutation.mutate(serviceToDelete.id, {
        onSuccess: () => {
          setServiceToDelete(null);
          if (data?.data.length === 1 && page > 1) {
            setPage(page - 1);
          }
        },
      });
    }
  };

  // --- Lógica de "Crear" y "Actualizar" ---
  const handleSubmit = (serviceData: CreateServiceDto) => {
    if (serviceToEdit) {
      // Modo Edición
      updateServiceMutation.mutate(
        { id: serviceToEdit.id, data: serviceData },
        {
          onSuccess: () => {
            setServiceToEdit(null); // Cierra el modal
          },
        }
      );
    } else {
      // Modo Creación
      createServiceMutation.mutate(serviceData, {
        onSuccess: () => {
          setIsCreateModalOpen(false); // Cierra el modal
        },
      });
    }
  };

  // --- Lógica de Cierre de Modal Unificada ---
  const closeFormModal = () => {
    setIsCreateModalOpen(false);
    setServiceToEdit(null);
  }

  // --- Renderizado ---
  return (
    <div className="p-4 md:p-6"> 
      
      {/* --- Cabecera: Título y Botón de Crear --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Administrar Servicios
        </h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          onClick={() => {
            setServiceToEdit(null); // Asegura que no esté en modo edición
            setIsCreateModalOpen(true);
          }}
        >
          + Crear Nuevo Servicio
        </button>
      </div>

      {/* --- Filtros --- */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar servicio por nombre..."
          className="shadow-sm appearance-none border-2 border-gray-200 rounded-lg w-full md:w-1/3 py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- Estado de Carga --- */}
      {isLoadingServices && (
        <p className="text-center text-gray-600 py-8">Cargando servicios...</p>
      )}

      {/* --- Estado de Error --- */}
      {isError && (
        <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
          Error al cargar servicios: {(error as Error).message}
        </p>
      )}

      {/* --- Tabla de Servicios --- */}
      {!isLoadingServices && !isError && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left text-gray-600 font-semibold uppercase text-sm">Nombre</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-semibold uppercase text-sm">Duración</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-semibold uppercase text-sm">Precio</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-semibold uppercase text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No se encontraron servicios. {search && 'Intenta con otra búsqueda.'}
                    </td>
                  </tr>
                ) : (
                  data?.data.map((service) => (
                    <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="py-4 px-6 font-medium">{service.name}</td>
                      <td className="py-4 px-6">{service.duration} min</td>
                      <td className="py-4 px-6">${service.price.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <button 
                          className="text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded text-sm"
                          onClick={() => setServiceToEdit(service)} // Abre el modal en modo edición
                        >
                          Editar
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 font-medium py-1 px-2 rounded text-sm ml-2"
                          onClick={() => setServiceToDelete(service)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- Controles de Paginación --- */}
          {data && data.meta.totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{data.data.length}</span> de <span className="font-medium">{data.meta.totalItems}</span> resultados
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </button>
                <span className="py-2 px-4 text-sm font-medium text-gray-700">
                  Página {data.meta.currentPage} de {data.meta.totalPages}
                </span>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={page >= data.meta.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}


      {/* --- Modales (se renderizan fuera del flujo) --- */}
      
      {/* Modal de Crear / Editar Servicio */}
      <ServiceFormModal
        isOpen={isCreateModalOpen || !!serviceToEdit} 
        onClose={closeFormModal}
        onSubmit={handleSubmit}
        isLoading={createServiceMutation.isPending || updateServiceMutation.isPending}
        initialData={serviceToEdit} 
      />
      
      {/* Modal de Confirmar Eliminación */}
      {serviceToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setServiceToDelete(null)}
          onConfirm={handleDeleteService}
          isLoading={deleteServiceMutation.isPending}
          title="Eliminar Servicio"
          message={`¿Estás seguro de que deseas eliminar el servicio "${serviceToDelete.name}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
        />
      )}

    </div>
  );
};

export default ServiciosPage;
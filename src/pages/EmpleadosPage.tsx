// frontend/src/pages/EmpleadosPage.tsx
import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees'; // <-- Hook actualizado
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import { useUpdateEmployee } from '../hooks/useUpdateEmployee';
import { useDeleteEmployee } from '../hooks/useDeleteEmployee';
import { type Employee, type CreateEmployeeDto } from '../types/employee.types';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { UserIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import EmployeeFormModal from '../components/employees/EmployeeFormModal';
import { Link } from 'react-router-dom';

const EmpleadosPage: React.FC = () => {
  // --- Hooks de "Leer" (AHORA CON PAGINACIÓN) ---
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    page, 
    setPage, 
    search, 
    setSearch 
  } = useEmployees();

  // --- Estados de los Modales ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // --- Hooks de Mutación (sin cambios) ---
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  // --- Handlers (Manejadores de Lógica) ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmployeeToEdit(null);
  };

  const handleOpenCreate = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: CreateEmployeeDto) => {
    if (employeeToEdit) {
      updateMutation.mutate({ id: employeeToEdit.id, data }, {
        onSuccess: handleCloseModal,
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: handleCloseModal,
      });
    }
  };

  const handleDelete = () => {
    if (employeeToDelete) {
      deleteMutation.mutate(employeeToDelete.id, {
        onSuccess: () => {
          setEmployeeToDelete(null);
          // Si borramos el último ítem, volvemos a la pág anterior
          if (data?.data.length === 1 && page > 1) {
            setPage(page - 1);
          }
        },
      });
    }
  };

  // --- Renderizado ---
  return (
    <div className="p-4 md:p-6">
      
      {/* --- Cabecera: Título y Botón de Crear --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Administrar Empleados
        </h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          onClick={handleOpenCreate}
        >
          + Añadir Empleado
        </button>
      </div>

      {/* --- ¡NUEVO! Input de Búsqueda --- */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar empleado por nombre..."
          className="shadow-sm appearance-none border-2 border-gray-200 rounded-lg w-full md:w-1/3 py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- Estado de Carga --- */}
      {isLoading && (
        <p className="text-center text-gray-600 py-8">Cargando empleados...</p>
      )}

      {/* --- Estado de Error --- */}
      {isError && (
        <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
          Error al cargar empleados: {(error as Error).message}
        </p>
      )}

      {/* --- Grid de Tarjetas de Empleados --- */}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-8">
                No se encontraron empleados. {search && 'Intenta con otra búsqueda.'}
              </p>
            ) : (
              data?.data.map((employee) => (
                <div 
                  key={employee.id} 
                  className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
                >
                  {/* --- Cabecera de la Tarjeta con Color --- */}
                  <div 
                    className="h-3 w-full" 
                    style={{ backgroundColor: employee.color || '#E2E8F0' }}
                  />
                  
                  {/* --- Cuerpo de la Tarjeta --- */}
                  <div className="p-5 flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 truncate mb-3">
                      {employee.name}
                    </h3>

                    <div className="space-y-2 text-gray-600">
                      {employee.email ? (
                        <div className="flex items-center text-sm">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                      ) : null}
                      {employee.phone ? (
                        <div className="flex items-center text-sm">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{employee.phone}</span>
                        </div>
                      ) : null}
                      {!employee.email && !employee.phone && (
                         <div className="flex items-center text-sm text-gray-400 italic">
                          (Sin datos de contacto)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- ¡DISEÑO CORREGIDO! Pie de la Tarjeta con Acciones --- */}
                  <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-100">
                    
                    <Link 
                      to={`/dashboard/empleados/${employee.id}/horario`}
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Horario
                    </Link>
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => handleOpenEdit(employee)}
                    >
                      Editar
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                      onClick={() => setEmployeeToDelete(employee)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- ¡NUEVO! Controles de Paginación --- */}
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

      {/* --- Modales (Sin cambios) --- */}

      {/* Modal de Crear/Editar */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={employeeToEdit}
      />

      {/* Modal de Confirmar Eliminación */}
      {employeeToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setEmployeeToDelete(null)}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          title="Eliminar Empleado"
          message={`¿Estás seguro de que deseas eliminar a "${employeeToDelete.name}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
        />
      )}
    </div>
  );
};

export default EmpleadosPage;
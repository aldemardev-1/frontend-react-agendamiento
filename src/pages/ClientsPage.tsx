import { useState } from 'react';
// Hooks (asegúrate de tenerlos todos)
import { useClientes } from '../hooks/useClients';
import { useCreateCliente } from '../hooks/useCreateClient';
import { useUpdateCliente } from '../hooks/useUpdateClient';
import { useDeleteCliente } from '../hooks/useDeleteClient';
import { type Cliente, type CreateClienteDto } from '../types/cliente.types';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import ClienteFormModal from '../components/clientes/ClienteFormModal';
// Iconos
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export function ClientesPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    page,
    setPage,
    search,
    setSearch,
  } = useClientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();
  const deleteMutation = useDeleteCliente();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClienteToEdit(null);
  };

  const handleOpenCreate = () => {
    setClienteToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setClienteToEdit(cliente);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: CreateClienteDto) => {
    if (clienteToEdit) {
      updateMutation.mutate(
        { id: clienteToEdit.id, data },
        {
          onSuccess: handleCloseModal,
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: handleCloseModal,
      });
    }
  };

  const handleDelete = () => {
    if (clienteToDelete) {
      deleteMutation.mutate(clienteToDelete.id, {
        onSuccess: () => {
          setClienteToDelete(null);
          if (data?.data.length === 1 && page > 1) {
            setPage(page - 1);
          }
        },
      });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Administrar Clientes
        </h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          onClick={handleOpenCreate}
        >
          + Añadir Cliente
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar cliente por nombre, email o teléfono..."
          className="shadow-sm appearance-none border-2 border-gray-200 rounded-lg w-full md:w-1/3 py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <p className="text-center text-gray-600 py-8">Cargando clientes...</p>
      )}

      {isError && (
        <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
          Error al cargar clientes: {(error as Error).message}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-8">
                No se encontraron clientes.{' '}
                {search && 'Intenta con otra búsqueda.'}
              </p>
            ) : (
              data?.data.map((cliente) => (
                <div
                  key={cliente.id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
                >
                  {/* --- Cuerpo de la Tarjeta --- */}
                  <div className="p-5 flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 truncate mb-3">
                      {cliente.name}
                    </h3>

                    <div className="space-y-2 text-gray-600">
                      {cliente.email ? (
                        <div className="flex items-center text-sm">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{cliente.email}</span>
                        </div>
                      ) : null}
                      {cliente.phone ? (
                        <div className="flex items-center text-sm">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{cliente.phone}</span>
                        </div>
                      ) : null}
                      {!cliente.email && !cliente.phone && (
                        <div className="flex items-center text-sm text-gray-400 italic">
                          (Sin datos de contacto)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- Pie de la Tarjeta con Acciones --- */}
                  <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => handleOpenEdit(cliente)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                      onClick={() => setClienteToDelete(cliente)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- Controles de Paginación --- */}
          {data && data.meta.totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{data.data.length}</span>{' '}
                  de{' '}
                  <span className="font-medium">{data.meta.totalItems}</span>{' '}
                  resultados
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

      <ClienteFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={clienteToEdit}
      />

      {clienteToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setClienteToDelete(null)}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          title="Eliminar Cliente"
          message={`¿Estás seguro de que deseas eliminar a "${clienteToDelete.name}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
        />
      )}
    </div>
  );
}


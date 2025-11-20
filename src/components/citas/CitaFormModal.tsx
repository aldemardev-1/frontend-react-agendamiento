import React, { useState, type FormEvent, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  UserGroupIcon,
  RectangleStackIcon,
  UserIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Importar los hooks que YA TIENES
import { useClientes } from '../../hooks/useClients';
import { useServices } from '../../hooks/useServices';
import { useEmployees } from '../../hooks/useEmployees';

// Importar los tipos
import { type Cita, type CreateCitaDto } from '../../types/cita.types';
import { type Service } from '../../types/service.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCitaDto | Partial<CreateCitaDto>) => void; // DTO de creación/actualización
  isLoading: boolean;
  initialData?: Cita | null;
  slotData?: { start: Date; end: Date } | null;
  onDelete: (cita: Cita) => void; // Función para abrir el modal de borrado
}

// Helper para formatear Date a 'yyyy-MM-ddTHH:mm'
const formatToDateTimeLocal = (date: Date) => {
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

const CitaFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  slotData,
  onDelete,
}) => {
  // --- Carga de datos para los <select> ---
  // Usamos los hooks que ya tienes, pedimos muchos para llenar los selectores
  const { data: clientesData } = useClientes();
  const { data: servicesData } = useServices();
  const { data: employeesData } = useEmployees();

  // --- Estado del Formulario ---
  const [clienteId, setClienteId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [notes, setNotes] = useState('');

  // Estado para guardar la duración del servicio seleccionado
  const [, setServiceDuration] = useState(0);

  useEffect(() => {
    if (initialData) {
      // --- Modo Editar ---
      setClienteId(initialData.clienteId || '');
      setServiceId(initialData.serviceId || '');
      setEmployeeId(initialData.employeeId || '');
      setStartTime(formatToDateTimeLocal(new Date(initialData.startTime)));
      setNotes(initialData.notes || '');
      setServiceDuration(initialData.service?.duration || 0);
    } else if (slotData) {
      // --- Modo Crear (desde un slot) ---
      setClienteId('');
      setServiceId('');
      setEmployeeId('');
      setStartTime(formatToDateTimeLocal(slotData.start));
      setNotes('');
      setServiceDuration(0);
    } else {
      // --- Modo Crear (desde el botón "+ Nueva Cita") ---
      setClienteId('');
      setServiceId('');
      setEmployeeId('');
      // Pone la hora actual redondeada a 30 min
      const now = new Date();
      const roundedMinutes = Math.floor(now.getMinutes() / 30) * 30;
      now.setMinutes(roundedMinutes);
      now.setSeconds(0);
      setStartTime(formatToDateTimeLocal(now));
      setNotes('');
      setServiceDuration(0);
    }
    // Se ejecuta cuando cambia la data inicial o el slot (al abrir el modal)
  }, [initialData, slotData, isOpen]);

  // --- Manejadores ---

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setServiceId(selectedId);
    // Buscar la duración del servicio seleccionado y guardarla
    const selectedService = servicesData?.data.find(
      (s: Service) => s.id === selectedId
    );
    setServiceDuration(selectedService?.duration || 0);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!serviceId) {
      alert("Por favor selecciona un servicio.");
      return;
    }
    
    // Calcular la hora de fin
    const startTimeDate = new Date(startTime);

    // --- ¡CORRECCIÓN! ---
    // No calculamos ni enviamos 'endTime'. El backend lo hace.
    const dataToSend: CreateCitaDto | Partial<CreateCitaDto> = {
      clienteId,
      serviceId,
      employeeId,
      startTime: startTimeDate.toISOString(), // Enviar solo startTime en formato ISO
      notes: notes || undefined,
    };
    
    onSubmit(dataToSend);
  };

  const title = initialData ? 'Editar Cita' : 'Crear Nueva Cita';
  const submitText = initialData ? 'Guardar Cambios' : 'Crear Cita';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* --- Overlay (Fondo) --- */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* --- Contenido del Modal --- */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* --- Selector de Cliente --- */}
                    <div>
                      <label htmlFor="cliente" className="block text-sm font-medium text-gray-600">
                        Cliente
                      </label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <UserGroupIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="cliente"
                          value={clienteId}
                          onChange={(e) => setClienteId(e.target.value)}
                          className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                          required
                        >
                          <option value="">Selecciona un cliente...</option>
                          {clientesData?.data.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                              {cliente.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* --- Selector de Servicio --- */}
                    <div>
                      <label htmlFor="servicio" className="block text-sm font-medium text-gray-600">
                        Servicio
                      </label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <RectangleStackIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="servicio"
                          value={serviceId}
                          onChange={handleServiceChange}
                          className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                          required
                        >
                          <option value="">Selecciona un servicio...</option>
                          {servicesData?.data.map((service: Service) => (
                            <option key={service.id} value={service.id}>
                              {service.name} ({service.duration} min)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* --- Selector de Empleado --- */}
                  <div>
                    <label htmlFor="empleado" className="block text-sm font-medium text-gray-600">
                      Empleado
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="empleado"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                        required
                      >
                        <option value="">Selecciona un empleado...</option>
                        {employeesData?.data.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* --- Selector de Fecha y Hora --- */}
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-600">
                      Fecha y Hora de Inicio
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="datetime-local"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* --- Notas Adicionales --- */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-600">
                      Notas (Opcional)
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-3">
                        <PencilIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                        placeholder="Ej: El cliente prefiere..."
                      />
                    </div>
                  </div>

                  {/* --- Botones --- */}
                  <div className="mt-6 flex justify-between gap-4 border-t border-gray-100 pt-5">
                    {/* Botón de Eliminar (solo en modo edición) */}
                    <div>
                      {initialData && (
                        <button
                          type="button"
                          onClick={() => onDelete(initialData)}
                          disabled={isLoading}
                          className="inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-red-100 px-5 py-2.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Eliminar
                        </button>
                      )}
                    </div>
                    
                    {/* Botones de Cancelar y Guardar */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={onClose}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300"
                      >
                        {isLoading ? 'Guardando...' : submitText}
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CitaFormModal;


import React, { useState, type FormEvent, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// --- ¡CAMBIOS! ---
// Importar tipos de Cliente
import { type Cliente, type CreateClienteDto } from '../../types/cliente.types.ts'; 
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClienteDto) => void;
  isLoading: boolean;
  // --- ¡CAMBIOS! ---
  // Usar tipo Cliente
  initialData?: Cliente | null; 
}

const ClienteFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // --- CAMBIO ---
  // Se elimina el estado 'color'

  useEffect(() => {
    if (initialData) {
      // Modo Editar
      setName(initialData.name);
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      // --- CAMBIO ---
      // Se elimina 'color'
    } else {
      // Modo Crear
      setName('');
      setEmail('');
      setPhone('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email: email || undefined,
      phone: phone || undefined,
      // --- CAMBIO ---
      // Se elimina 'color'
    });
  };

  // --- ¡CAMBIOS! ---
  // Títulos
  const title = initialData ? 'Editar Cliente' : 'Añadir Cliente';
  const submitText = initialData ? 'Guardar Cambios' : 'Guardar Cliente';

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
            {/* --- Panel --- */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {/* --- Input de Nombre (Requerido) --- */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Nombre Completo
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                        required
                        placeholder="Ej: Juan Pérez"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* --- Inputs Opcionales (Email y Teléfono) --- */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Email (Opcional)
                      </label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                          placeholder="juan@correo.com"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Teléfono (Opcional)
                      </label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                          placeholder="300 123 4567"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* --- CAMBIO --- */}
                  {/* Sección de 'Color' eliminada */}
                  
                  {/* --- Botones --- */}
                  <div className="mt-6 flex justify-end gap-4 border-t border-gray-100 pt-5">
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
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ClienteFormModal;


// frontend/src/components/services/ServiceFormModal.tsx
import React, { useState, Fragment, useEffect, type FormEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { type CreateServiceDto, type Service } from '../../types/service.types';
import { 
  TagIcon, 
  ClockIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateServiceDto) => void;
  isLoading: boolean;
  initialData?: Service | null; // Prop para modo "Editar"
}

const ServiceFormModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  initialData 
}) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(0);

  // Lógica para rellenar el formulario
  useEffect(() => {
    if (initialData) {
      // Modo Editar: Rellenar con datos existentes
      setName(initialData.name);
      setDuration(initialData.duration);
      setPrice(initialData.price);
    } else {
      // Modo Crear: Limpiar el formulario
      setName('');
      setDuration(30);
      setPrice(0);
    }
    // Este efecto se ejecuta cada vez que 'initialData' o 'isOpen' cambian
  }, [initialData, isOpen]); 

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, duration, price });
  };

  // Títulos y textos dinámicos
  const title = initialData ? 'Editar Servicio' : 'Crear Nuevo Servicio';
  const submitText = initialData ? 'Guardar Cambios' : 'Guardar Servicio';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay */}
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

        {/* Contenido del Modal */}
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
              {/* Panel del Modal */}
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-900"
                >
                  {title} {/* <-- Título dinámico */}
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  
                  {/* --- Input de Nombre --- */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                      Nombre del Servicio
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
                        required
                        placeholder="Ej: Corte de Caballero"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  
                  {/* --- Inputs de Duración y Precio --- */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-600">
                        Duración (min)
                      </label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="number"
                          id="duration"
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          required
                          min="5"
                          autoComplete="off"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-gray-500">
                        Debe ser al menos 5 min.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-600">
                        Precio ($)
                      </label>
                       <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <CurrencyDollarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="number"
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          required
                          min="0"
                          step="0.01"
                          autoComplete="off"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-gray-500">
                        No puede ser negativo.
                      </p>
                    </div>
                  </div>

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
                      {isLoading ? 'Guardando...' : submitText} {/* <-- Texto dinámico */}
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

export default ServiceFormModal;
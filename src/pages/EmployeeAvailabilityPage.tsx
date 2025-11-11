import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save, AlertCircle, Loader2 } from 'lucide-react';

// --- Imports de tus Hooks y Tipos ---
import { useEmployeeAvailability } from '../hooks/useEmployeeAvailability.ts';
import { useUpdateAvailability } from '../hooks/useUpdateAvailability.ts';

// --- 1. Importar los tipos reales de tu archivo ---
import { 
  type AvailabilitySlot, 
  type UpdateAvailabilityDto 
} from '../types/employee.types.ts';

// --- 2. Definir el tipo de UN item del payload ---
// (Esto se infiere de tu 'UpdateAvailabilityDto')
type AvailabilityPayloadItem = UpdateAvailabilityDto['availability'][number];

// --- Constantes ---
const DAYS_OF_WEEK = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// --- Componentes de la Página ---

/**
 * Props para el componente DayAvailabilityRow
 */
interface DayAvailabilityRowProps {
  // --- 3. Usar tu tipo 'AvailabilitySlot' importado ---
  dayData: AvailabilitySlot; 
  onDayChange: (dayOfWeek: number, updatedDayData: AvailabilitySlot) => void;
}

/**
 * Componente para una sola fila de día (ej: Lunes [x] 09:00 a 17:00)
 */
function DayAvailabilityRow({ dayData, onDayChange }: DayAvailabilityRowProps) {
  const { dayOfWeek, isAvailable, startTime, endTime } = dayData;
  const dayName = DAYS_OF_WEEK[dayOfWeek];

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsAvailable = e.target.checked;
    onDayChange(dayOfWeek, {
      ...dayData,
      isAvailable: newIsAvailable,
      // Si se deshabilita, limpiar las horas
      startTime: newIsAvailable ? startTime || '09:00' : null,
      endTime: newIsAvailable ? endTime || '17:00' : null,
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDayChange(dayOfWeek, {
      ...dayData,
      [e.target.name]: e.target.value || null,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
      {/* Checkbox y Nombre del Día */}
      <div className="md:col-span-1 flex items-center">
        <input
          type="checkbox"
          id={`check-${dayName}`}
          checked={isAvailable}
          onChange={handleCheckboxChange}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor={`check-${dayName}`}
          className={`ml-3 block text-sm font-medium ${
            isAvailable ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {dayName}
        </label>
      </div>

      {/* Inputs de Hora */}
      <div className="md:col-span-3 flex items-center gap-4">
        <input
          type="time"
          name="startTime"
          value={startTime || ''}
          onChange={handleTimeChange}
          disabled={!isAvailable}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50"
        />
        <span className={isAvailable ? 'text-gray-600' : 'text-gray-400'}>a</span>
        <input
          type="time"
          name="endTime"
          value={endTime || ''}
          onChange={handleTimeChange}
          disabled={!isAvailable}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50"
        />
      </div>
    </div>
  );
}

/**
 * Props para el componente AvailabilityForm
 */
interface AvailabilityFormProps {
  // --- 4. Usar tu tipo 'AvailabilitySlot' importado ---
  initialData: AvailabilitySlot[];
  id: string; // ID del empleado
}

/**
 * Componente del formulario principal que maneja el estado
 */
function AvailabilityForm({ initialData, id }: AvailabilityFormProps) {
  // Estado del formulario, inicializado con los datos de la API
  const [availability, setAvailability] = useState(initialData);

  // Usar tu Hook de Mutación
  const updateAvailabilityMutation = useUpdateAvailability();

  // Sincronizar estado si los datos de la query cambian (ej: al guardar)
  useEffect(() => {
    setAvailability(initialData);
  }, [initialData]);

  // Manejador para actualizar un día específico en el estado
  const handleDayChange = (dayOfWeek: number, updatedDayData: AvailabilitySlot) => {
    setAvailability((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek ? updatedDayData : day
      )
    );
  };

  // Manejador del envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // --- 5. Usar el tipo 'AvailabilityPayloadItem' ---
    const payload: AvailabilityPayloadItem[] = availability.map(({ dayOfWeek, isAvailable, startTime, endTime }) => ({
      dayOfWeek,
      isAvailable,
      startTime: isAvailable ? startTime : null,
      endTime: isAvailable ? endTime : null,
    }));

    // --- 6. El objeto 'data' ahora coincide con 'UpdateAvailabilityDto' ---
    const data: UpdateAvailabilityDto = {
      availability: payload
    };

    // Llamar a la mutación con la estructura que espera tu hook
    updateAvailabilityMutation.mutate({
      employeeId: id, // El ID del empleado de la URL
      data: data,      // El DTO esperado por el backend
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestionar Horario
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Define los días y horas en que este empleado está disponible para recibir citas.
        </p>
      </div>

      {/* Renderizar las 7 filas de días */}
      <div className="border-t border-gray-200">
        {/* Usamos el estado local 'availability' para renderizar */}
        {availability.map((day) => (
          <DayAvailabilityRow
            key={day.dayOfWeek}
            dayData={day}
            onDayChange={handleDayChange}
          />
        ))}
      </div>

      {/* Footer con botón de guardar */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end">
        <button
          type="submit"
          disabled={updateAvailabilityMutation.isPending}
          className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          {updateAvailabilityMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {updateAvailabilityMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}

/**
 * Página principal que obtiene los datos
 */
export function EmployeeAvailabilityPage() {
  // Obtener 'id' real de la URL
  const { id } = useParams<{ id: string }>(); // Añadimos tipo a useParams

  // Usar tu Hook de Query
  // (Asegurarse de que 'id' no sea undefined antes de pasarlo)
  const { data, isLoading, isError, error } = useEmployeeAvailability(id || '');

  if (isLoading || !id) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-700">Cargando horario...</span>
      </div>
    );
  }

  if (isError) {
    // Definimos el tipo del error para un acceso seguro
    const apiError = error as { response?: { data?: { message?: string } } };

    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{apiError?.response?.data?.message || 'No se pudo obtener la disponibilidad.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ordenar los datos por si acaso la API no lo hace
  // --- 7. Usar tu tipo 'AvailabilitySlot' importado ---
  const sortedData = (data as AvailabilitySlot[]).sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* (Opcional) Título de la página con el nombre del empleado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Horario del Empleado</h1>
        <p className="text-gray-600">ID: {id}</p>
      </div>

      <AvailabilityForm initialData={sortedData} id={id} />
    </div>
  );
}



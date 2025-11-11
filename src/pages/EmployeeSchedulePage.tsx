import { useState } from 'react';
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Clock, Save, AlertCircle, Loader2 } from 'lucide-react';

// --- Configuración (Simulación de API y React Router) ---

// 1. Simulación del cliente de API (reemplaza esto con tu fetch real)
const apiClient = {
  get: async (url) => {
    console.log(`[API MOCK] GET: ${url}`);
    const employeeId = url.split('/')[3]; // Extrae el ID de la URL
    // Este es el JSON de ejemplo que me pasaste
    return [
      { id: "cmhe6jdp00002sjskaequpsv1", dayOfWeek: 0, isAvailable: false, startTime: null, endTime: null, employeeId: employeeId },
      { id: "cmhe6jdp00003sjsk3gu0pfrm", dayOfWeek: 1, isAvailable: true, startTime: "09:00", endTime: "17:00", employeeId: employeeId },
      { id: "cmhe6jdp00004sjskdd19nvbs", dayOfWeek: 2, isAvailable: true, startTime: "09:00", endTime: "17:00", employeeId: employeeId },
      { id: "cmhe6jdp00005sjsksebc6jot", dayOfWeek: 3, isAvailable: false, startTime: null, endTime: null, employeeId: employeeId },
      { id: "cmhe6jdp00006sjskjeowpbcq", dayOfWeek: 4, isAvailable: true, startTime: "09:00", endTime: "13:00", employeeId: employeeId },
      { id: "cmhe6jdp00007sjskvmx0jhlp", dayOfWeek: 5, isAvailable: true, startTime: "10:00", endTime: "18:00", employeeId: employeeId },
      { id: "cmhe6jdp00008sjsk6ipo4044", dayOfWeek: 6, isAvailable: false, startTime: null, endTime: null, employeeId: employeeId }
    ].sort((a, b) => a.dayOfWeek - b.dayOfWeek); // Asegura el orden
  },
  patch: async (url, data) => {
    console.log(`[API MOCK] PATCH: ${url}`, data);
    // Simula un retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Devuelve los datos enviados como confirmación
    return data.availability;
  },
};

// 2. Simulación de React Router (useParams)
// React Router pasaría el ID del empleado desde la URL
const useParams = () => ({
  employeeId: 'cmhe6jdop0001sjskebddjgdn', // ID de ejemplo
});

// 3. Cliente de Tanstack Query
const queryClient = new QueryClient();

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
 * Componente para una sola fila de día (ej: Lunes [x] 09:00 a 17:00)
 */
function DayAvailabilityRow({ dayData, onDayChange }) {
  const { dayOfWeek, isAvailable, startTime, endTime } = dayData;
  const dayName = DAYS_OF_WEEK[dayOfWeek];

  const handleCheckboxChange = (e) => {
    const newIsAvailable = e.target.checked;
    onDayChange(dayOfWeek, {
      ...dayData,
      isAvailable: newIsAvailable,
      // Si se deshabilita, limpiar las horas
      startTime: newIsAvailable ? startTime || '09:00' : null,
      endTime: newIsAvailable ? endTime || '17:00' : null,
    });
  };

  const handleTimeChange = (e) => {
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
 * Componente del formulario principal que maneja el estado
 */
function AvailabilityForm({ initialData, employeeId }) {
  // Estado del formulario, inicializado con los datos de la API
  const [availability, setAvailability] = useState(initialData);

  // Mutación para actualizar la disponibilidad
  const updateAvailabilityMutation = useMutation({
    mutationFn: (newAvailability) =>
      apiClient.patch(`/api/employees/${employeeId}/availability`, {
        availability: newAvailability, // El backend espera un objeto { availability: [...] }
      }),
    onSuccess: (data) => {
      // Actualizar los datos en caché de Tanstack Query
      queryClient.setQueryData(['availability', employeeId], data);
      // (Opcional) Mostrar un toast/notificación de éxito
      console.log('¡Horario guardado con éxito!');
    },
    onError: (error) => {
      // (Opcional) Mostrar un toast/notificación de error
      console.error('Error al guardar:', error);
    },
  });

  // Manejador para actualizar un día específico en el estado
  const handleDayChange = (dayOfWeek, updatedDayData) => {
    setAvailability((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek ? updatedDayData : day
      )
    );
  };

  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpiar los datos: quitar 'id' y 'employeeId' si existen
    const payload = availability.map(({ dayOfWeek, isAvailable, startTime, endTime }) => ({
      dayOfWeek,
      isAvailable,
      startTime: isAvailable ? startTime : null,
      endTime: isAvailable ? endTime : null,
    }));

    updateAvailabilityMutation.mutate(payload);
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
function EmployeeAvailabilityPage() {
  const { employeeId } = useParams(); // Obtiene el ID del empleado de la URL

  // Query para obtener la disponibilidad
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['availability', employeeId],
    queryFn: () => apiClient.get(`/api/employees/${employeeId}/availability`),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-700">Cargando horario...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message || 'No se pudo obtener la disponibilidad.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* (Opcional) Título de la página con el nombre del empleado */}
      {/* Podrías hacer otra query para `GET /employees/:id` y obtener el nombre */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Horario de Pedro</h1> {/* Nombre hardcodeado */}
        <p className="text-gray-600">ID de Empleado: {employeeId}</p>
      </div>

      <AvailabilityForm initialData={data} employeeId={employeeId} />
    </div>
  );
}

/**
 * Componente principal de la App
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        {/* Aquí iría tu Layout principal (Sidebar, Header, etc.) */}
        <EmployeeAvailabilityPage />
      </div>
    </QueryClientProvider>
  );
}

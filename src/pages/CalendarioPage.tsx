import React, { useState, useMemo } from 'react';
// ¡LA CORRECCIÓN! Importar el CSS de la librería
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from 'date-fns';
// Importación corregida para el idioma
import { es } from 'date-fns/locale'; 
import { useCitas } from '../hooks/useCitas'; 
import { type Cita } from '../types/cita.types';
// Hooks para mutaciones
import { useCreateCita } from '../hooks/useCreateCita';
import { useUpdateCita } from '../hooks/useUpdateCita';
import { useDeleteCita } from '../hooks/useDeleteCita';
// Modales
import CitaFormModal from '../components/citas/CitaFormModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

// --- Configuración de date-fns (en español) ---
const locales = {
  es: es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }), // Empezar semana en Lunes
  getDay,
  locales,
});
// --- Fin de Configuración ---

// --- Traducción de mensajes ---
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Cita',
  noEventsInRange: 'No hay citas en este rango.',
  showMore: (total: number) => `+${total} más`,
};

// --- Función para obtener el rango de fechas de la vista ---
const getRange = (date: Date, view: View) => {
  let start: Date;
  let end: Date;

  if (view === 'month') {
    start = startOfMonth(date);
    end = endOfMonth(date);
  } else if (view === 'week') {
    start = startOfWeek(date, { locale: es });
    end = endOfDay(startOfWeek(date, { locale: es }));
  } else {
    // 'day' or 'agenda'
    start = startOfDay(date);
    end = endOfDay(date);
  }
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

export const CalendarioPage: React.FC = () => {
  // Estado para la vista actual y el rango de fechas
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState(() => getRange(date, view));

  // Estado para los modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(
    null
  );

  // --- Hook de Citas (con filtro de rango) ---
  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useCitas({
    initialLimit: 500, // Traer muchas citas para el calendario
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  
  // --- Hooks de Mutaciones ---
  const createCitaMutation = useCreateCita();
  const updateCitaMutation = useUpdateCita();
  const deleteCitaMutation = useDeleteCita();

  // --- Mapeo de Citas para el Calendario ---
  const events = useMemo(() => {
    if (!paginatedData) return [];

    return paginatedData.data.map((cita) => ({
      ...cita,
      // Usamos el nombre del cliente y servicio si están disponibles
      title: `${cita.cliente?.name || 'Cliente'} - ${
        cita.service?.name || 'Servicio'
      }`,
      start: new Date(cita.startTime), // Convertir ISO string a Date
      end: new Date(cita.endTime), // Convertir ISO string a Date
    }));
  }, [paginatedData]);

  // --- Handlers (Manejadores) ---

  // Actualizar el rango de fechas cuando cambia la vista o la fecha
  const handleRangeChange = (newDate: Date, newView?: View) => {
    const currentView = newView || view;
    setDate(newDate);
    setView(currentView);
    setDateRange(getRange(newDate, currentView));
  };

  // Se dispara al hacer clic en una cita existente
  const handleSelectEvent = (event: Cita) => {
    setSelectedCita(event);
    setSelectedSlot(null); // Limpiar slot
    setIsModalOpen(true);
  };

  // Se dispara al hacer clic y arrastrar en un espacio vacío
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedCita(null); // Limpiar cita
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCita(null);
    setSelectedSlot(null);
  };
  
  const handleCloseDeleteModal = () => {
    setCitaToDelete(null);
  }

  // Manejador para el formulario de citas
  const handleFormSubmit = (data) => {
    // Lógica para crear o actualizar la cita
    if (selectedCita) {
      // Actualizar
      updateCitaMutation.mutate({ id: selectedCita.id, data }, {
        onSuccess: handleCloseModal
      });
    } else {
      // Crear
      createCitaMutation.mutate(data, {
        onSuccess: handleCloseModal
      });
    }
  };
  
  // Manejador para eliminar
  const handleDeleteCita = () => {
    if (citaToDelete) {
      deleteCitaMutation.mutate(citaToDelete.id, {
        onSuccess: () => {
          handleCloseDeleteModal();
          handleCloseModal(); // Cierra el modal de edición si estaba abierto
        }
      });
    }
  }

  if (isLoading) return <p>Cargando calendario...</p>;
  if (isError) return <p>Error al cargar las citas.</p>;

  return (
    <div className="p-4 md:p-6">
      {/* --- Cabecera: Título y Botón de Crear --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Calendario</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          onClick={() => {
            setSelectedSlot(null);
            setSelectedCita(null);
            setIsModalOpen(true);
          }}
        >
          + Nueva Cita
        </button>
      </div>

      {/* --- El Calendario --- */}
      {/* ¡CORRECCIÓN! Añadir 'div' con altura */}
      <div style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="es" // Usar español
          messages={messages} // Usar mensajes traducidos
          
          // Vistas
          views={['month', 'week', 'day', 'agenda']}
          view={view} // Vista controlada
          date={date} // Fecha controlada
          onView={setView} // Manejador de cambio de vista
          onNavigate={handleRangeChange} // Manejador de cambio de fecha
          onRangeChange={(range, newView) => {
            // Se dispara al cambiar de vista (ej. de Mes a Semana)
            if (newView) {
              handleRangeChange(date, newView);
            }
          }}
          
          // Handlers de selección
          onSelectEvent={handleSelectEvent as (event: object) => void}
          onSelectSlot={handleSelectSlot}
          selectable // Permite seleccionar slots vacíos

          // Estilos y formato
          defaultView="week"
          min={new Date(0, 0, 0, 8, 0, 0)} // Hora mínima (8:00 AM)
          max={new Date(0, 0, 0, 20, 0, 0)} // Hora máxima (8:00 PM)
          className="bg-white rounded-lg shadow-md"
        />
      </div>

      {/* --- Modal de Crear/Editar Cita --- */}
      {isModalOpen && (
        <CitaFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          initialData={selectedCita}
          slotData={selectedSlot}
          onDelete={(cita) => setCitaToDelete(cita)} // Pasar handler para eliminar
          isLoading={createCitaMutation.isPending || updateCitaMutation.isPending}
        />
      )}
      

      {citaToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteCita}
          isLoading={deleteCitaMutation.isPending}
          title="Eliminar Cita"
          message={`¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
        />
      )}
      
    </div>
  );
};

export default CalendarioPage;


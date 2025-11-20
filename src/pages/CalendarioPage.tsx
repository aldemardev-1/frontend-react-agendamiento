import React, { useState, useMemo } from 'react';
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
import { es } from 'date-fns/locale';
import { useCitas } from '../hooks/useCitas';
import { type Cita, type CreateCitaDto } from '../types/cita.types';
import { useCreateCita } from '../hooks/useCreateCita';
import { useUpdateCita } from '../hooks/useUpdateCita';
import { useDeleteCita } from '../hooks/useDeleteCita';
import CitaFormModal from '../components/citas/CitaFormModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const locales = {
  es: es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

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
    start = startOfDay(date);
    end = endOfDay(date);
  }
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

export const CalendarioPage: React.FC = () => {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState(() => getRange(date, view));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(
    null
  );

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useCitas({
    initialLimit: 500,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  
  const createCitaMutation = useCreateCita();
  const updateCitaMutation = useUpdateCita();
  const deleteCitaMutation = useDeleteCita();

  const events = useMemo(() => {
    if (!paginatedData) return [];

    return paginatedData.data.map((cita) => ({
      ...cita,
      title: `${cita.cliente?.name || 'Cliente'} - ${
        cita.service?.name || 'Servicio'
      }`,
      start: new Date(cita.startTime),
      end: new Date(cita.endTime),
    }));
  }, [paginatedData]);

  const handleRangeChange = (newDate: Date, newView?: View) => {
    const currentView = newView || view;
    setDate(newDate);
    setView(currentView);
    setDateRange(getRange(newDate, currentView));
  };

  const handleSelectEvent = (event: Cita) => {
    setSelectedCita(event);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedCita(null);
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

  // CORRECCIÓN: Tipado explícito para 'data'
  const handleFormSubmit = (data: CreateCitaDto | Partial<CreateCitaDto>) => {
    if (selectedCita) {
      updateCitaMutation.mutate({ id: selectedCita.id, data }, {
        onSuccess: handleCloseModal
      });
    } else {
      createCitaMutation.mutate(data as CreateCitaDto, {
        onSuccess: handleCloseModal
      });
    }
  };
  
  const handleDeleteCita = () => {
    if (citaToDelete) {
      deleteCitaMutation.mutate(citaToDelete.id, {
        onSuccess: () => {
          handleCloseDeleteModal();
          handleCloseModal();
        }
      });
    }
  }

  if (isLoading) return <p>Cargando calendario...</p>;
  if (isError) return <p>Error al cargar las citas.</p>;

  return (
    <div className="p-4 md:p-6">
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

      <div style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          messages={messages}
          
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          date={date}
          onView={setView}
          onNavigate={handleRangeChange}
          // CORRECCIÓN: Usar _range para evitar el error
          onRangeChange={(_range, newView) => {
            if (newView) {
              handleRangeChange(date, newView);
            }
          }}
          
          onSelectEvent={handleSelectEvent as (event: object) => void}
          onSelectSlot={handleSelectSlot}
          selectable

          defaultView="week"
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
          className="bg-white rounded-lg shadow-md"
        />
      </div>

      {isModalOpen && (
        <CitaFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          initialData={selectedCita}
          slotData={selectedSlot}
          onDelete={(cita) => setCitaToDelete(cita)}
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
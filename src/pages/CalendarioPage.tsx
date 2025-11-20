import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, type View, type EventProps } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// --- ¡IMPORTANTE! Importa tus estilos personalizados aquí ---
import '../components/calendar/CalendarStyles.css'; 

import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  endOfWeek, // Importamos esto
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useCitas } from '../hooks/useCitas';
import { type Cita, type CreateCitaDto } from '../types/cita.types';
import { useCreateCita } from '../hooks/useCreateCita';
import { useUpdateCita } from '../hooks/useUpdateCita';
import { useDeleteCita } from '../hooks/useDeleteCita';
import CitaFormModal from '../components/citas/CitaFormModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import CustomToolbar from '../components/calendar/CustomToolbar';
import { PlusIcon } from 'lucide-react';

// --- Configuración ---
const locales = { es: es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

// Mensajes en español
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
  event: 'Evento',
  noEventsInRange: 'No tienes citas programadas para este rango.', // Mensaje más claro
  showMore: (total: number) => `+ Ver ${total} más`,
};

// --- CORRECCIÓN CLAVE: Rango de Fechas ---
// Para que el calendario se vea bien, necesitamos traer la semana completa,
// incluso si el mes empieza un miércoles.
const getRange = (date: Date, view: View) => {
  let start: Date;
  let end: Date;

  if (view === 'month') {
    // Truco: Empezamos desde el INICIO de la SEMANA del inicio del mes
    start = startOfWeek(startOfMonth(date), { locale: es });
    // Y terminamos en el FIN de la SEMANA del fin del mes
    end = endOfWeek(endOfMonth(date), { locale: es });
  } else if (view === 'week') {
    start = startOfWeek(date, { locale: es });
    end = endOfWeek(date, { locale: es });
  } else {
    start = startOfDay(date);
    end = endOfDay(date);
  }
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

// --- Componente de Tarjeta de Cita ---
const CustomEvent = ({ event }: EventProps<any>) => {
  return (
    <div className="flex flex-col leading-none py-0.5">
      <span className="font-bold text-xs truncate">{event.clienteName}</span>
      <span className="text-[10px] opacity-90 truncate">{event.serviceName}</span>
    </div>
  );
};

export const CalendarioPage: React.FC = () => {
  // Detectar móvil inicial
  const [view, setView] = useState<View>(window.innerWidth < 768 ? 'day' : 'month'); // Empezamos en MES si es PC
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState(() => getRange(date, view));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  // Escuchar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && view === 'month') {
        // Opcional: Cambiar a día si se hace muy pequeño
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  // Carga de datos
  const { data: paginatedData, isLoading, isError } = useCitas({
    initialLimit: 1000, // Traemos bastantes para llenar el mes
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const createCitaMutation = useCreateCita();
  const updateCitaMutation = useUpdateCita();
  const deleteCitaMutation = useDeleteCita();

  // Mapeo de eventos
  const events = useMemo(() => {
    if (!paginatedData) return [];
    return paginatedData.data.map((cita) => ({
      ...cita,
      title: `${cita.cliente?.name}`, // Título principal
      clienteName: cita.cliente?.name || 'Cliente',
      serviceName: cita.service?.name || 'Servicio',
      // ¡IMPORTANTE! Aseguramos que sean objetos Date
      start: new Date(cita.startTime),
      end: new Date(cita.endTime),
      resource: cita,
    }));
  }, [paginatedData]);

  // Estilos dinámicos (Colores)
  const eventStyleGetter = (event: any) => {
    const isPast = new Date(event.end) < new Date();
    let backgroundColor = isPast ? '#94a3b8' : '#3b82f6'; // Gris si ya pasó, Azul si es futura
    
    if (event.status === 'CANCELLED') backgroundColor = '#ef4444'; // Rojo si cancelada
    if (event.status === 'CONFIRMED') backgroundColor = '#10b981'; // Verde si confirmada

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 1,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleRangeChange = (newDate: Date, newView?: View) => {
    const currentView = newView || view;
    setDate(newDate);
    setView(currentView);
    // Recalcular el rango para traer los datos correctos
    setDateRange(getRange(newDate, currentView));
  };

  const handleSelectEvent = (event: any) => {
    setSelectedCita(event.resource);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // Evitar crear citas en el pasado (opcional)
    // if (slotInfo.start < new Date()) return; 
    
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

  const handleFormSubmit = (data: CreateCitaDto | Partial<CreateCitaDto>) => {
    if (selectedCita) {
      updateCitaMutation.mutate({ id: selectedCita.id, data }, { onSuccess: handleCloseModal });
    } else {
      createCitaMutation.mutate(data as CreateCitaDto, { onSuccess: handleCloseModal });
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

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p>Cargando tu agenda...</p>
    </div>
  );

  if (isError) return <div className="p-8 text-red-500 bg-red-50 rounded-xl m-4">Error al cargar el calendario. Por favor recarga la página.</div>;

  return (
    <div className="h-full flex flex-col bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="px-4 md:px-6 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Calendario</h2>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona tus citas y disponibilidad.
          </p>
        </div>
        
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95 w-full md:w-auto justify-center"
          onClick={() => {
            setSelectedSlot(null);
            setSelectedCita(null);
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5" />
          Nueva Cita
        </button>
      </div>

      {/* Contenedor del Calendario - Aquí aplicamos la altura fija corregida */}
      <div className="flex-1 px-4 md:px-6 pb-6 flex flex-col overflow-hidden">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 md:p-4 flex-1 flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
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
              
              components={{
                toolbar: CustomToolbar,
                event: CustomEvent,
              }}
              
              eventPropGetter={eventStyleGetter}
              className="font-sans text-sm flex-1" // flex-1 para que llene el contenedor
              
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              
              // Límites visuales para vistas de día/semana
              min={new Date(0, 0, 0, 7, 0, 0)} // 7:00 AM
              max={new Date(0, 0, 0, 21, 0, 0)} // 9:00 PM
            />
        </div>
      </div>

      {/* Modales */}
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
          message="¿Estás seguro? El espacio se liberará inmediatamente."
          confirmText="Sí, eliminar"
        />
      )}
    </div>
  );
};

export default CalendarioPage;
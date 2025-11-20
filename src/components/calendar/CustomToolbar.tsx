import React from 'react';
import { type ToolbarProps } from 'react-big-calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, LayoutGrid } from 'lucide-react';

const CustomToolbar: React.FC<ToolbarProps> = ({ date, view, onView, onNavigate }) => {
  
  const goToBack = () => onNavigate('PREV');
  const goToNext = () => onNavigate('NEXT');
  const goToToday = () => onNavigate('TODAY');

  // --- LÓGICA INTELIGENTE DEL TÍTULO ---
  const getLabel = () => {
    if (view === 'day') {
      // Vista Día: "Miércoles 20 de Noviembre"
      return format(date, "EEEE d 'de' MMMM", { locale: es });
    }
    if (view === 'week') {
      // Vista Semana: "Semana del 20 Nov" (Opcional, o dejar solo Mes)
      return `Semana del ${format(date, 'd', { locale: es })} de ${format(date, 'MMMM', { locale: es })}`;
    }
    // Vista Mes/Agenda: "Noviembre 2025"
    return format(date, 'MMMM yyyy', { locale: es });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 bg-white p-2 rounded-lg border border-gray-200/50">
      {/* Grupo 1: Navegación y Título */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
          <button 
            onClick={goToBack} 
            className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600"
            title="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={goToToday} 
            className="px-4 text-sm font-bold text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition mx-1"
          >
            Hoy
          </button>
          <button 
            onClick={goToNext} 
            className="p-2 hover:bg-white hover:shadow-sm rounded-md transition text-gray-600"
            title="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* AQUÍ SE MUESTRA EL TÍTULO DINÁMICO */}
        <h2 className="text-lg md:text-xl font-bold text-gray-800 capitalize min-w-[180px]">
          {getLabel()}
        </h2>
      </div>

      {/* Grupo 2: Selector de Vistas */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-full md:w-auto shadow-inner">
        {[
          { id: 'month', label: 'Mes', icon: LayoutGrid },
          { id: 'week', label: 'Semana', icon: CalendarIcon },
          { id: 'day', label: 'Día', icon: CalendarIcon },
          { id: 'agenda', label: 'Agenda', icon: List },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => onView(v.id as any)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              view === v.id
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            <v.icon className="h-4 w-4" />
            <span className="hidden md:inline">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomToolbar;
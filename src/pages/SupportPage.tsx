import React from 'react';
import { 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon, 
  QuestionMarkCircleIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

const SupportPage: React.FC = () => {

  const tutorials = [
    { title: 'Cómo crear tu primer servicio', duration: '2 min', url: '#' },
    { title: 'Configurar horarios de empleados', duration: '3 min', url: '#' },
    { title: 'Cómo compartir tu link en WhatsApp', duration: '1 min', url: '#' },
  ];

  const faqs = [
    { 
      q: '¿Cómo cambio mi plan?', 
      a: 'Ve a la sección de "Negocios" en el menú lateral y selecciona "Cambiar Plan".' 
    },
    { 
      q: '¿Mis clientes necesitan descargar una app?', 
      a: 'No, ellos reservan directamente desde el navegador a través de tu link único.' 
    },
    { 
      q: '¿Cómo cancelo una cita?', 
      a: 'Desde el Calendario, haz clic en la cita y selecciona la opción "Eliminar" o "Cancelar".' 
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Centro de Ayuda</h1>
        <p className="text-slate-500 mt-1">Aprende a usar la plataforma y resuelve tus dudas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Tutoriales y Contacto */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tarjeta de Tutoriales */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <VideoCameraIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Video Tutoriales</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {tutorials.map((video, idx) => (
                <a 
                  key={idx} 
                  href={video.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <PlayCircleIcon className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <div>
                      <p className="font-medium text-slate-700 group-hover:text-blue-600">{video.title}</p>
                      <p className="text-xs text-slate-400">{video.duration}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-700">
                    Ver Video
                  </span>
                </a>
              ))}
            </div>
            <div className="p-4 bg-slate-50 text-center">
              <p className="text-sm text-slate-500">¿Necesitas un video específico? <span className="text-blue-600 font-medium cursor-pointer">Solicítalo aquí</span></p>
            </div>
          </div>

          {/* Sección de Preguntas Frecuentes (Accordion) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <QuestionMarkCircleIcon className="h-5 w-5 text-slate-400" />
              Preguntas Frecuentes
            </h3>
            
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none bg-white hover:bg-slate-50 transition-colors">
                  <span className="font-medium text-slate-700">{faq.q}</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-slate-600 px-4 pb-4 pt-0 text-sm leading-relaxed border-t border-slate-100 mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

        </div>

        {/* Columna Derecha: Contacto Directo */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
            <ChatBubbleLeftRightIcon className="h-10 w-10 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">¿Necesitas ayuda humana?</h3>
            <p className="text-blue-100 text-sm mb-6">
              Nuestro equipo de soporte está disponible para ayudarte a configurar tu cuenta.
            </p>
            <a 
              href="https://wa.me/573222708870" // PON TU NÚMERO AQUÍ
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-white text-blue-700 text-center font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Contactar por WhatsApp
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2">Tips Rápidos</h4>
            <ul className="space-y-3 text-sm text-slate-600 list-disc pl-4">
              <li>Completa tu perfil en <b>Configuración</b>.</li>
              <li>Agrega al menos un <b>Empleado</b>.</li>
              <li>Crea tus <b>Servicios</b> con duración y precio.</li>
              <li>¡Comparte tu link en Instagram!</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupportPage;
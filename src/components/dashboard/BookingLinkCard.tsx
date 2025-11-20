import React, { useState } from 'react';
// Ajusta esta ruta según donde tengas tu store
import { useAuthStore } from '../../store/auth.store'; 
import { 
  ClipboardDocumentIcon, 
  CheckIcon, 
  ShareIcon, 
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const BookingLinkCard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [copied, setCopied] = useState(false);

  // Si no hay usuario cargado, no mostramos nada
  if (!user) return null;

  // URL dinámica: toma el dominio actual (sea localhost o producción) + ID usuario
  const bookingUrl = `${window.location.origin}/${user.id}/book`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = `¡Hola! 👋 Reserva tu cita con nosotros aquí: ${bookingUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 mb-8 relative overflow-hidden">
      {/* Decoración de fondo (círculo borroso) */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
            <GlobeAltIcon className="h-6 w-6 text-blue-200" />
            Tu Link de Reservas
          </h2>
          <p className="text-blue-100 text-sm mt-1 max-w-md">
            Comparte este enlace en tu Instagram, WhatsApp o Facebook para que tus clientes agenden solos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Input visual del link */}
          <div className="flex items-center bg-blue-800/50 rounded-xl px-4 py-2 border border-blue-500/30 flex-1 min-w-[200px]">
            <span className="text-blue-200 text-xs truncate mr-2">{bookingUrl}</span>
          </div>

          <div className="flex gap-2">
            {/* Botón Copiar */}
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm"
              title="Copiar Link"
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>

            {/* Botón WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm"
              title="Enviar por WhatsApp"
            >
              <ShareIcon className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingLinkCard;
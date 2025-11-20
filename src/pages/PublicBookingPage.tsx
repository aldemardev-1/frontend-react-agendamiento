import React, { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicServices } from '../hooks/usePublicServices.ts';
import { usePublicEmployees } from '../hooks/usePublicEmployees.ts';
import { usePublicAvailability } from '../hooks/usePublicAvailability.ts';
import { usePublicBooking } from '../hooks/usePublicBooking.ts'; // <-- 1. IMPORTAR
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

// Iconos de lucide-react
import {
  Boxes,
  Users,
  CalendarDays,
  Loader2,
  User, // <-- 2. IMPORTAR NUEVOS ICONOS
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const PublicBookingPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  // --- Estado del Wizard ---
  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState(''); // "HH:mm"

  // --- 3. ¡NUEVO! Estado para el formulario del cliente ---
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // --- Carga de Datos (Hooks) ---
  const { data: services, isLoading: isLoadingServices } = usePublicServices(userId!);
  const { data: employees, isLoading: isLoadingEmployees } = usePublicEmployees(userId!);

  const {
    data: availability,
    isLoading: isLoadingAvailability,
    isError: isErrorAvailability,
  } = usePublicAvailability({
    date: selectedDate,
    employeeId: selectedEmployeeId,
    serviceId: selectedServiceId,
    // se activa solo si los 3 campos están llenos
  });

  // --- 4. ¡NUEVO! Hook de Mutación (Reserva) ---
  const bookingMutation = usePublicBooking();

  // --- Lógica de Nombres (para el resumen) ---
  const serviceName = services?.find(s => s.id === selectedServiceId)?.name;
  const employeeName = employees?.find(e => e.id === selectedEmployeeId)?.name;

  // Limpiar slots si algo cambia
  useEffect(() => {
    setSelectedSlot('');
  }, [selectedServiceId, selectedEmployeeId, selectedDate]);


  // --- 5. ¡NUEVO! Manejador para la reserva final ---
  const handleSubmitBooking = (e: FormEvent) => {
    e.preventDefault();

    if (!userId || !selectedServiceId || !selectedEmployeeId || !selectedDate || !selectedSlot) {
      alert("Error: Faltan datos clave de la reserva.");
      return;
    }
    
    bookingMutation.mutate({
      userId, // ID del Negocio (del useParams)
      serviceId: selectedServiceId,
      employeeId: selectedEmployeeId,
      date: selectedDate,
      startTime: selectedSlot,
      clientName,
      clientEmail,
      clientPhone,
      notes: clientNotes || undefined,
    }, {
      onSuccess: () => {
        setStep(5); // Ir al paso de Confirmación
      },
      // El error se muestra en el componente
    });
  };


  // --- Renderizado de Pasos ---

  const renderStepOne = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Paso 1: Elige un Servicio</h3>
      {isLoadingServices ? (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      ) : (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Boxes className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
            value={selectedServiceId}
            onChange={(e) => {
              setSelectedServiceId(e.target.value);
              setStep(2); // Avanza al siguiente paso
            }}
          >
            <option value="">Selecciona un servicio...</option>
            {services?.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.duration} min) - ${service.price}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-4">
      {/* Resumen Paso 1 */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-600">Servicio:</p>
        <p className="font-semibold">{serviceName}</p>
        <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline">Cambiar</button>
      </div>

      <h3 className="text-lg font-medium text-gray-700">Paso 2: Elige un Empleado</h3>
      {isLoadingEmployees ? (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      ) : (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
            value={selectedEmployeeId}
            onChange={(e) => {
              setSelectedEmployeeId(e.target.value);
              setStep(3); // Avanza al siguiente paso
            }}
          >
            <option value="">Selecciona un empleado...</option>
            {employees?.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderStepThree = () => (
    <div className="space-y-4">
      {/* Resumen Pasos 1 y 2 */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-600">Servicio:</p>
          <p className="font-semibold">{serviceName}</p>
          <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline">Cambiar</button>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Empleado:</p>
          <p className="font-semibold">{employeeName}</p>
          <button onClick={() => setStep(2)} className="text-xs text-blue-600 hover:underline">Cambiar</button>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-700">Paso 3: Elige Fecha y Hora</h3>
      
      {/* Selector de Fecha */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <CalendarDays className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={format(new Date(), 'yyyy-MM-dd')} // No se puede reservar en el pasado
          className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
        />
      </div>

      {/* Slots de Hora */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600">Horas Disponibles</h4>
        {isLoadingAvailability ? (
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        ) : isErrorAvailability ? (
          <p className="text-red-600 text-sm">Error al cargar la disponibilidad.</p>
        ) : availability && availability.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {availability.map(slot => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  setSelectedSlot(slot);
                  setStep(4); // <-- 6. AVANZAR AL PASO 4
                }}
                className={`text-center rounded-lg p-3 text-sm font-medium border-2
                  ${selectedSlot === slot 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'
                  }`}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg">
            No hay horas disponibles para este día o empleado.
          </p>
        )}
      </div>
    </div>
  );

  // --- 7. ¡NUEVO! RENDERIZADO DEL PASO 4 ---
  const renderStepFour = () => {
    const formattedDate = format(
      parse(`${selectedDate}T${selectedSlot}`, "yyyy-MM-dd'T'HH:mm", new Date()),
      "eeee dd 'de' MMMM, yyyy 'a las' HH:mm",
      { locale: es }
    );
    
    return (
      <form onSubmit={handleSubmitBooking} className="space-y-4">
        {/* Resumen Final */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Resumen de tu Cita</h3>
          <div className="text-sm">
            <p><span className="font-semibold text-gray-700">Servicio:</span> {serviceName}</p>
            <p><span className="font-semibold text-gray-700">Empleado:</span> {employeeName}</p>
            <p><span className="font-semibold text-gray-700">Fecha:</span> <span className="capitalize">{formattedDate}</span></p>
          </div>
          <button onClick={() => setStep(3)} className="text-xs text-blue-600 hover:underline">Cambiar hora</button>
        </div>
        
        <h3 className="text-lg font-medium text-gray-700">Paso 4: Tus Datos</h3>

        {/* Input Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Nombre Completo</label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text" id="name" value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
              required placeholder="Tu nombre"
            />
          </div>
        </div>

        {/* Input Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email" id="email" value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
              required placeholder="tu@correo.com"
            />
          </div>
        </div>

        {/* Input Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Teléfono</label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel" id="phone" value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="block w-full rounded-lg border-2 border-gray-200 p-3 pl-10 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
              required placeholder="300 123 4567"
            />
          </div>
        </div>

        {/* Input Notas */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-600">Notas (Opcional)</label>
          <div className="relative mt-1">
            <textarea
              id="notes" rows={2} value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              className="block w-full rounded-lg border-2 border-gray-200 p-3 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-0"
              placeholder="¿Algo que debamos saber?"
            />
          </div>
        </div>

        {/* Error de la Mutación */}
        {bookingMutation.isError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>Error: {bookingMutation.error.message || 'No se pudo crear la cita.'}</p>
          </div>
        )}

        {/* Botón de Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={bookingMutation.isPending}
            className="w-full flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {bookingMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Confirmando...
              </>
            ) : (
              'Confirmar Cita'
            )}
          </button>
        </div>
      </form>
    );
  };
  
  // --- 8. ¡NUEVO! RENDERIZADO DEL PASO 5 (CONFIRMACIÓN) ---
  const renderStepFive = () => {
    const reservedCita = bookingMutation.data;
    
    return (
      <div className="space-y-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800">¡Cita Confirmada!</h2>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-left space-y-2 text-gray-700">
          <p><span className="font-semibold">Servicio:</span> {reservedCita?.service?.name}</p>
          <p><span className="font-semibold">Empleado:</span> {reservedCita?.employee?.name}</p>
          <p><span className="font-semibold">Cliente:</span> {reservedCita?.cliente?.name}</p>
          <p className="capitalize"><span className="font-semibold">Fecha:</span> {format(
              new Date(reservedCita?.startTime || ''),
              "eeee dd 'de' MMMM, yyyy 'a las' HH:mm",
              { locale: es }
            )}
          </p>
        </div>
        <p className="text-gray-600">
          Hemos recibido tu reserva. Recibirás una confirmación en tu correo.
        </p>
        <button
          onClick={() => {
            // Reiniciar todo
            setStep(1);
            setSelectedServiceId('');
            setSelectedEmployeeId('');
            setSelectedSlot('');
            setClientName('');
            setClientEmail('');
            setClientPhone('');
            setClientNotes('');
            bookingMutation.reset();
          }}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Reservar otra cita
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Reserva tu Cita
      </h2>
      
      {/* Selector de Pasos */}
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
      {step === 3 && renderStepThree()}
      {step === 4 && renderStepFour()}
      {step === 5 && renderStepFive()}
      
    </div>
  );
};

export default PublicBookingPage;


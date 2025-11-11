import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import { Loader2, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const CancelPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  // Hook de mutación
  const {
    mutate: cancel,
    isPending,
    isSuccess,
    isError,
    data: cancelledCita,
    errorMessage,
  } = useCancelAppointment();

  // Al cargar la página, ejecutar la mutación (cancelación)
  useEffect(() => {
    if (token && !isSuccess && !isPending && !isError) {
      cancel(token);
    }
  }, [token, cancel, isSuccess, isPending, isError]);

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {/* --- Estado de Carga --- */}
          {isPending && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-700">
                Procesando cancelación...
              </h2>
            </div>
          )}

          {/* --- Estado de Éxito --- */}
          {isSuccess && (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-bold text-gray-800">¡Cita Cancelada!</h2>
              <p className="text-gray-600">
                Tu cita para{' '}
                <strong>
                  {(cancelledCita as any)?.service?.name || 'el servicio'}
                </strong>{' '}
                el{' '}
                <strong className="capitalize">
                  {format(
                    new Date((cancelledCita as any)?.startTime),
                    "eeee dd/MM/yy 'a las' HH:mm",
                    { locale: es },
                  )}
                </strong>
                , ha sido cancelada exitosamente.
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Home className="h-4 w-4" />
                Volver al inicio
              </Link>
            </div>
          )}

          {/* --- Estado de Error --- */}
          {isError && (
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-bold text-gray-800">Error al Cancelar</h2>
              <p className="text-gray-600">
                No pudimos procesar tu cancelación.
              </p>
              <p className="text-sm text-red-700 bg-red-100 p-3 rounded-md">
                <strong>Motivo:</strong> {errorMessage || 'Error desconocido.'}
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
              >
                <Home className="h-4 w-4" />
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelPage;


import { useMutation } from '@tanstack/react-query';
import { cancelAppointment } from '../api/public.api';
import { AxiosError } from 'axios';

interface ApiError {
  message: string;
}

export const useCancelAppointment = () => {
  const mutation = useMutation<
    unknown, // Tipo de dato que esperamos (Cita)
    Error | AxiosError<ApiError>, // Tipo del error
    string // Tipo de dato que recibe (el token)
  >({
    mutationFn: (token: string) => cancelAppointment(token),
  });

  // Extraer el mensaje de error de forma segura
  const errorMessage =
    mutation.error instanceof AxiosError && mutation.error.response
      ? mutation.error.response.data.message
      : mutation.error?.message;

  return {
    ...mutation,
    errorMessage,
  };
};


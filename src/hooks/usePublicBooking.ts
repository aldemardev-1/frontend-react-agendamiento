import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bookAppointment,
  type PublicBookingDto,
} from '../api/public.api.ts'; // Asegúrate que la ruta sea correcta

export const usePublicBooking = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: PublicBookingDto) => bookAppointment(data),

    onSuccess: () => {
      // Cuando una reserva pública es exitosa, invalidamos
      // la data de disponibilidad para que se refresque
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      // También invalidamos las citas del panel de admin
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
    // (El manejo de errores se hará en el componente)
  });

  return mutation;
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCita } from '../api/citas.api.ts';
import { type CreateCitaDto } from '../types/cita.types.ts';

export const useCreateCita = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCitaDto) => createCita(data),
    onSuccess: () => {
      // Invalida todas las queries de 'citas' para refrescar el calendario
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      alert('¡Cita creada exitosamente!'); // (Puedes cambiar esto por un Toaster)
    },
    onError: (error: any) => {
      alert(`Error al crear la cita: ${error.response?.data?.message}`);
    },
  });
};

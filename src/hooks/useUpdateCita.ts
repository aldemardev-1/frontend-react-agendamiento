import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCita } from '../api/citas.api.ts';
import { type UpdateCitaDto } from '../types/cita.types.ts';

interface UpdateVariables {
  id: string;
  data: UpdateCitaDto;
}

export const useUpdateCita = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: UpdateVariables) => updateCita(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      alert('¡Cita actualizada exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al actualizar la cita: ${error.response?.data?.message}`);
    },
  });
};

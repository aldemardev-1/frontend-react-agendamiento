import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCita } from '../api/citas.api.ts';

export const useDeleteCita = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteCita(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      alert('¡Cita eliminada exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al eliminar la cita: ${error.response?.data?.message}`);
    },
  });
};

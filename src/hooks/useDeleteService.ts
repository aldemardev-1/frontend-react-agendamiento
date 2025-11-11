// frontend/src/hooks/useDeleteService.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteService } from '../api/services.api';

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (serviceId: string) => deleteService(serviceId),

    onSuccess: () => {
      // Invalida la query para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['services'] });
      alert('¡Servicio eliminado exitosamente!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      alert(`Error al eliminar el servicio: ${errorMessage}`);
    },
  });

  return mutation;
};
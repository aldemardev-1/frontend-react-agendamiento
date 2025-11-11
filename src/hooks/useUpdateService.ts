// frontend/src/hooks/useUpdateService.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateService } from '../api/services.api';
import type { CreateServiceDto } from '../types/service.types';

interface UpdateVariables {
  id: string;
  data: Partial<CreateServiceDto>;
}

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // El 'mutationFn' ahora espera un objeto con 'id' y 'data'
    mutationFn: ({ id, data }: UpdateVariables) => updateService(id, data),

    onSuccess: () => {
      // Invalida la query para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['services'] });
      alert('¡Servicio actualizado exitosamente!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      alert(`Error al actualizar el servicio: ${errorMessage}`);
    },
  });

  return mutation;
};
// frontend/src/hooks/useCreateService.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createService } from '../api/services.api';
import type { CreateServiceDto } from '../types/service.types';

export const useCreateService = () => {
  // 1. Obtenemos el cliente de query
  const queryClient = useQueryClient();

  // 2. Definimos la mutación
  const mutation = useMutation({
    mutationFn: (data: CreateServiceDto) => createService(data),

    // 3. ¡La magia! Cuando la mutación es exitosa...
    onSuccess: () => {
      // 4. Invalidamos la 'queryKey' de ['services'].
      //    Esto le dice a TanStack Query que los datos están "viejos"
      //    y que debe volver a ejecutar 'getServices' automáticamente.
      queryClient.invalidateQueries({ queryKey: ['services'] });

      // (Aquí podríamos añadir un toast de éxito)
      alert('¡Servicio creado exitosamente!');
    },
    onError: (error: any) => {
      // (Aquí podríamos añadir un toast de error)
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      alert(`Error al crear el servicio: ${errorMessage}`);
    },
  });

  return mutation;
};
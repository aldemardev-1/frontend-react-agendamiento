import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAvailability } from '../api/employees.api';
import { type UpdateAvailabilityDto } from '../types/employee.types';

interface UpdateVariables {
  employeeId: string;
  data: UpdateAvailabilityDto;
}

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, data }: UpdateVariables) => 
      updateAvailability(employeeId, data),

    onSuccess: (_, variables) => { // <-- CORRECCIÓN: Cambiar 'data' por '_'
      // Invalida la query específica de este empleado para refrescar
      queryClient.invalidateQueries({ queryKey: ['availability', variables.employeeId] });
      alert('¡Horario actualizado exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al actualizar el horario: ${error.response?.data?.message}`);
    },
  });
};
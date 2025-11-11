// frontend/src/hooks/useDeleteEmployee.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEmployee } from '../api/employees.api';

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      alert('¡Empleado eliminado exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al eliminar el empleado: ${error.response?.data?.message}`);
    },
  });
};
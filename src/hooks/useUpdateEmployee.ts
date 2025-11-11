// frontend/src/hooks/useUpdateEmployee.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployee } from '../api/employees.api';
import { type UpdateEmployeeDto } from '../types/employee.types';

interface UpdateVariables {
  id: string;
  data: UpdateEmployeeDto;
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateVariables) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      alert('¡Empleado actualizado exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al actualizar el empleado: ${error.response?.data?.message}`);
    },
  });
};
// frontend/src/hooks/useCreateEmployee.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee } from '../api/employees.api';
import { type CreateEmployeeDto } from '../types/employee.types';

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      alert('¡Empleado creado exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al crear el empleado: ${error.response?.data?.message}`);
    },
  });
};
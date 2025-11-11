// frontend/src/hooks/useEmployeeAvailability.ts
import { useQuery } from '@tanstack/react-query';
import { getAvailability } from '../api/employees.api';

export const useEmployeeAvailability = (employeeId: string) => {
  const query = useQuery({
    // La queryKey incluye el ID del empleado para ser única
    queryKey: ['availability', employeeId],
    queryFn: () => getAvailability(employeeId),
    // Deshabilitamos 'refetchOnWindowFocus' para que el horario
    // no se recargue solo por cambiar de pestaña.
    refetchOnWindowFocus: false,
  });
  return query;
};
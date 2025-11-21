import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBusinessPlan, type Plan } from '../api/admin.api';

interface UpdatePlanVariables {
  userId: string;
  plan: Plan; // Usamos el tipo Plan importado (que es 'FREE' | 'PROFESIONAL' | ...)
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, plan }: UpdatePlanVariables) =>
      // CORRECCIÓN: Pasamos 'plan' directamente, sin llaves {}
      updateBusinessPlan(userId, plan),
      
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      // alert('¡Plan actualizado exitosamente!'); // Opcional
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error desconocido';
      alert(`Error al actualizar el plan: ${msg}`);
    },
  });
};
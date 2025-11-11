import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBusinessPlan } from '../api/admin.api';

interface UpdatePlanVariables {
  userId: string;
  plan: 'GRATIS' | 'PROFESIONAL' | 'EMPRESA';
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, plan }: UpdatePlanVariables) =>
      updateBusinessPlan(userId, { plan }),
      
    onSuccess: () => {
      // Refrescar la lista de negocios
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      alert('¡Plan actualizado exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al actualizar el plan: ${error.response?.data?.message}`);
    },
  });
};
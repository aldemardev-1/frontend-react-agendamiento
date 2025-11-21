import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
// import { useAuthStore } from '../store/auth.store';

export const useProfile = () => {
  const queryClient = useQueryClient();
  // Actualizamos también el store de Zustand para que el nombre cambie en el sidebar al instante
//   const setToken = useAuthStore((state) => state.setToken); 

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data } = await api.patch('/users/profile', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Perfil actualizado correctamente');
      // Aquí podríamos actualizar el token o el usuario en el store si el backend devolviera un nuevo token
      // Por ahora, basta con invalidar queries.
    },
  });

  return { data, isLoading, updateProfileMutation };
};
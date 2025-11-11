import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCliente } from '../api/clients.api'; // Ajusta la ruta

export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCliente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      alert('¡Cliente eliminado exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al eliminar el cliente: ${error.response?.data?.message}`);
    },
  });
};

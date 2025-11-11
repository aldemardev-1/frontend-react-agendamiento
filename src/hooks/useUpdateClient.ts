import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCliente } from '../api/clients.api'; // Ajusta la ruta
import { type UpdateClienteDto } from '../types/cliente.types'; // Ajusta la ruta

interface UpdateVariables {
  id: string;
  data: UpdateClienteDto;
}

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateVariables) => updateCliente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      alert('¡Cliente actualizado exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al actualizar el cliente: ${error.response?.data?.message}`);
    },
  });
};

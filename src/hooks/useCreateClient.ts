import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCliente } from '../api/clients.api'; // Ajusta la ruta
import { type CreateClienteDto } from '../types/cliente.types'; // Ajusta la ruta

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClienteDto) => createCliente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      // Aquí deberías usar un 'toast' en lugar de 'alert'
      alert('¡Cliente creado exitosamente!');
    },
    onError: (error: any) => {
      alert(`Error al crear el cliente: ${error.response?.data?.message}`);
    },
  });
};

import api from './axios'; // Asumo que tienes tu 'axios.ts'
import {
  type Cliente,
  type CreateClienteDto,
  type UpdateClienteDto,
  type PaginatedClientesResponse,
} from '../types/cliente.types'; // Ajusta la ruta a tus tipos

interface GetClientesParams {
  page: number;
  limit: number;
  search: string;
}

export const getClientes = async ({ page, limit, search }: GetClientesParams) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) {
    params.append('search', search);
  }

  const response = await api.get<PaginatedClientesResponse>('/clientes', {
    params,
  });
  return response.data;
};

export const createCliente = async (data: CreateClienteDto) => {
  const response = await api.post<Cliente>('/clientes', data);
  return response.data;
};

export const updateCliente = async (id: string, data: UpdateClienteDto) => {
  const response = await api.patch<Cliente>(`/clientes/${id}`, data);
  return response.data;
};

export const deleteCliente = async (id: string) => {
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
};

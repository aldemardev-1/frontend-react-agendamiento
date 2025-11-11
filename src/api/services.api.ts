// frontend/src/api/services.api.ts
import api from './axios';
import { type CreateServiceDto, type PaginatedServicesResponse, type Service } from '../types/service.types';

interface GetServicesParams {
  page: number;
  limit: number;
  search: string;
}

// Esta función será llamada por TanStack Query
export const getServices = async ({ page, limit, search }: GetServicesParams) => {

  // Construimos los 'query params'
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) {
    params.append('search', search);
  }

  // Hacemos la petición GET
  const response = await api.get<PaginatedServicesResponse>('/services', { params });

  return response.data;
};

export const createService = async (serviceData: CreateServiceDto) => {
  const response = await api.post<Service>('/services', serviceData);
  return response.data;
};

export const deleteService = async (serviceId: string) => {
  const response = await api.delete(`/services/${serviceId}`);
  return response.data;
};

export const updateService = async (
  serviceId: string, 
  data: Partial<CreateServiceDto>
) => {
  const response = await api.patch<Service>(`/services/${serviceId}`, data);
  return response.data;
};
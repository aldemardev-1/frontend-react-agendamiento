import api from './axios.ts'; // Asumo que tu archivo axios está en './axios.ts'
import {
  type Cita,
  type CreateCitaDto,
  type UpdateCitaDto,
  type PaginatedCitasResponse,
} from '../types/cita.types.ts';

// --- Interface para los parámetros de GET ---
// (Basado en el query-cita.dto.ts del backend)
interface GetCitasParams {
  page: number;
  limit: number;
  startDate?: string; // ISO String
  endDate?: string;   // ISO String
  employeeId?: string;
}

// --- GET (Obtener Citas con Paginación y Filtros) ---
export const getCitas = async (params: GetCitasParams) => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });

  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.employeeId) queryParams.append('employeeId', params.employeeId);

  const response = await api.get<PaginatedCitasResponse>('/citas', {
    params: queryParams,
  });
  
  return response.data;
};

// --- POST (Crear Cita) ---
export const createCita = async (data: CreateCitaDto) => {
  const response = await api.post<Cita>('/citas', data);
  return response.data;
};

// --- PATCH (Actualizar Cita) ---
export const updateCita = async (id: string, data: UpdateCitaDto) => {
  const response = await api.patch<Cita>(`/citas/${id}`, data);
  return response.data;
};

// --- DELETE (Eliminar Cita) ---
export const deleteCita = async (id: string) => {
  const response = await api.delete(`/citas/${id}`);
  return response.data;
};

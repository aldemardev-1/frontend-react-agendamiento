// frontend/src/api/employees.api.ts
import api from './axios';
import { 
  type Employee, 
  type CreateEmployeeDto, 
  type UpdateEmployeeDto,
  type PaginatedEmployeesResponse, // <-- ¡Importar!
  type AvailabilitySlot,
  type UpdateAvailabilityDto
} from '../types/employee.types';

// --- ¡TIPO DE PARÁMETROS ACTUALIZADO! ---
interface GetEmployeesParams {
  page: number;
  limit: number;
  search: string;
}

// --- ¡FUNCIÓN ACTUALIZADA! ---
export const getEmployees = async ({ page, limit, search }: GetEmployeesParams) => {
  
  // Construimos los 'query params'
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) {
    params.append('search', search);
  }

  // Hacemos la petición GET con los params
  const response = await api.get<PaginatedEmployeesResponse>('/employees', { params });
  
  return response.data;
};

// --- POST (Crear) --- (Sin cambios)
export const createEmployee = async (data: CreateEmployeeDto) => {
  const response = await api.post<Employee>('/employees', data);
  return response.data;
};

// --- PATCH (Actualizar) --- (Sin cambios)
export const updateEmployee = async (id: string, data: UpdateEmployeeDto) => {
  const response = await api.patch<Employee>(`/employees/${id}`, data);
  return response.data;
};

// --- DELETE (Eliminar) --- (Sin cambios)
export const deleteEmployee = async (id: string) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};

// --- GET (Horario de UN empleado) ---
export const getAvailability = async (employeeId: string) => {
  const response = await api.get<AvailabilitySlot[]>(`/employees/${employeeId}/availability`);
  return response.data;
};

// --- PATCH (Actualizar Horario) ---
export const updateAvailability = async (employeeId: string, data: UpdateAvailabilityDto) => {
  const response = await api.patch<AvailabilitySlot[]>(`/employees/${employeeId}/availability`, data);
  return response.data;
};
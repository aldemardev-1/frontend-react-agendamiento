import api from './axios';
import { type Service } from '../types/service.types';
import { type Employee } from '../types/employee.types';
import { type Cita } from '../types/cita.types';

// DTO para la API de disponibilidad
interface AvailabilityParams {
  date: string;
  employeeId: string;
  serviceId: string;
}

// DTO para la API de reserva
export interface PublicBookingDto {
  userId: string;
  serviceId: string;
  employeeId: string;
  date: string; // "yyyy-MM-dd"
  startTime: string; // "HH:mm"
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
}

const BASE_URL = '/public';

// 1. Obtener servicios de un negocio
export const getPublicServices = async (userId: string) => {
  const response = await api.get<Service[]>(`${BASE_URL}/services/${userId}`);
  return response.data;
};

// 2. Obtener todos los empleados de un negocio
export const getPublicEmployees = async (userId: string) => {
  const response = await api.get<Employee[]>(`${BASE_URL}/employees/${userId}`);
  return response.data;
};

// 3. Obtener slots de disponibilidad
export const getPublicAvailability = async ({
  date,
  employeeId,
  serviceId,
}: AvailabilityParams) => {
  const params = new URLSearchParams();
  params.append('date', date);
  params.append('employeeId', employeeId);
  params.append('serviceId', serviceId);
  
  // Devuelve un array de strings (ej: ["09:00", "09:15"])
  const response = await api.get<string[]>(`${BASE_URL}/availability`, { params });
  return response.data;
};

// 4. Función para crear la reserva
export const bookAppointment = async (data: PublicBookingDto) => {
  const response = await api.post<Cita>(`${BASE_URL}/book`, data);
  return response.data;
};

// --- ¡NUEVA FUNCIÓN! ---
/**
 * Llama al endpoint del backend para cancelar una cita.
 * @param token - El 'cancelToken' único de la cita
 */
export const cancelAppointment = async (token: string) => {
  const response = await api.patch<Cita>(`${BASE_URL}/cancel/${token}`);
  return response.data;
};


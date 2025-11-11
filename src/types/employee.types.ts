// frontend/src/types/employee.types.ts

// La forma de un solo empleado (viene del backend)
export interface Employee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  color: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// El DTO para crear un empleado
export interface CreateEmployeeDto {
  name: string;
  email?: string;
  phone?: string;
  color?: string;
}

// El DTO para actualizar (parcial)
export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

// --- ¡NUEVO! ---
// Metadatos de paginación
export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

// --- ¡NUEVO! ---
// La respuesta paginada de la API
export interface PaginatedEmployeesResponse {
  data: Employee[];
  meta: PaginationMeta;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // (0-6)
  isAvailable: boolean;
  startTime: string | null; // "HH:mm"
  endTime: string | null;   // "HH:mm"
}

// Define el DTO que enviamos para actualizar
export interface UpdateAvailabilityDto {
  availability: {
    dayOfWeek: number;
    isAvailable: boolean;
    startTime: string | null;
    endTime: string | null;
  }[];
}

// interface UpdateAvailabilityPayload {
//   dayOfWeek: number;
//   isAvailable: boolean;
//   startTime: string | null;
//   endTime: string | null;
// }

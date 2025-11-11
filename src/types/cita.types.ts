// --- Tipos Mínimos para las Relaciones ---
// (Basado en el JSON que me enviaste)

interface ClienteMin {
  name: string;
  phone: string | null;
}

interface ServiceMin {
  name: string;
  duration: number;
  price: number;
}

interface EmployeeMin {
  name: string;
  color: string | null;
}


// --- Interface de Cita (¡CORREGIDA!) ---
export interface Cita {
  id: string;
  startTime: string; // ISO String (ej: "2025-11-05T09:00:00.000Z")
  endTime: string;   // ISO String
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  // IDs de las relaciones
  clienteId: string;
  serviceId: string;
  employeeId: string;

  // --- ¡CORRECCIÓN! ---
  // Ahora TypeScript sabe que estos objetos existen.
  cliente: ClienteMin;
  service: ServiceMin;
  employee: EmployeeMin;
}

// --- DTO para Crear una Cita ---
// (Sin cambios)
export interface CreateCitaDto {
  clienteId: string;
  serviceId: string;
  employeeId: string;
  startTime: string; // ISO String o un objeto Date
  notes?: string;
}

// --- DTO para Actualizar una Cita ---
// (Sin cambios)
export interface UpdateCitaDto extends Partial<CreateCitaDto> {
  // Todos los campos de CreateCitaDto se vuelven opcionales
}

// --- Respuesta Paginada (Sin cambios) ---
export interface PaginatedCitasResponse {
  data: Cita[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}


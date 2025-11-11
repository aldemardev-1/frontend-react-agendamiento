// frontend/src/types/service.types.ts

// Define la forma de un solo servicio
export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Define la respuesta de la API (con paginación)
export interface PaginatedServicesResponse {
  data: Service[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

export interface CreateServiceDto {
  name: string;
  duration: number;
  price: number;
}
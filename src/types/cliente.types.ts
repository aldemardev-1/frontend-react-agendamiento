// (Solo como referencia, no es un archivo nuevo si ya tienes uno de tipos)

export interface Cliente {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteDto {
  name: string;
  email?: string;
  phone?: string;
}

export type UpdateClienteDto = Partial<CreateClienteDto>;

// La respuesta paginada de tu API
export interface PaginatedClientesResponse {
  data: Cliente[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

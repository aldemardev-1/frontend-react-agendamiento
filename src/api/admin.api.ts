import api from './axios';

// 1. Tipos locales (deben coincidir con el backend)
type Plan = 'GRATIS' | 'PROFESIONAL' | 'EMPRESA';

interface User {
  id: string;
  email: string;
  businessName: string;
  role: string;
  plan: Plan;
  maxEmployees: number;
  maxServices: number;
  planExpiresAt: string | null; // <-- ¡AÑADIDO!
  _count: {
    employees: number;
    services: number;
    clientes: number;
    citas: number;
  };
}

// 2. Tipo para la respuesta paginada
interface PaginatedUsersResponse {
  data: User[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

// 3. Tipo para los parámetros de GET
interface GetAdminParams {
  page: number;
  limit: number;
  search: string;
}

// 4. GET /admin/businesses (Paginado)
export const getBusinesses = async ({ page, limit, search }: GetAdminParams) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) {
    params.append('search', search);
  }
  
  const response = await api.get<PaginatedUsersResponse>('/admin/businesses', { params });
  return response.data;
};

// 5. PATCH /admin/businesses/:id/plan
export interface UpdatePlanDto { // Exportar para que el hook lo use
  plan: Plan;
}
export const updateBusinessPlan = async (userId: string, data: UpdatePlanDto) => {
  const response = await api.patch<User>(`/admin/businesses/${userId}/plan`, data);
  return response.data;
};
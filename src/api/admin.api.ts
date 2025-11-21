import api from './axios';

// 1. Tipos de Datos
export type Plan = 'FREE' | 'PROFESIONAL' | 'EMPRESA';

export interface BusinessUser {
  id: string;
  email: string;
  businessName: string;
  role: string;
  plan: Plan;
  maxEmployees: number;
  maxServices: number;
  planExpiresAt: string | null;
  createdAt: string;
  _count: {
    employees: number;
    services: number;
    clientes: number;
    citas: number;
  };
}

export interface GetBusinessesResponse {
  data: BusinessUser[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

// --- ¡ESTO ES LO QUE TE FALTA! ---
export interface AdminGlobalStats {
  totalBusinesses: number;
  totalCitas: number;
  mrr: number;
}
// --------------------------------

// 2. Funciones de Petición

export const getBusinesses = async (params: { page: number; limit: number; search: string }) => {
  const { data } = await api.get<GetBusinessesResponse>('/admin/businesses', { params });
  return data;
};

// --- ¡ESTA ES LA FUNCIÓN QUE DA EL ERROR! ---
export const getAdminStats = async () => {
  const { data } = await api.get<AdminGlobalStats>('/admin/stats');
  return data;
};
// -------------------------------------------

export const updateBusinessPlan = async (userId: string, plan: Plan) => {
  const { data } = await api.patch<BusinessUser>(`/admin/businesses/${userId}/plan`, { plan });
  return data;
};
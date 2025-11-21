import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export interface DashboardStatsResponse {
  income: {
    current: number;
    last: number;
    growth: number;
  };
  totalAppts: number;
  chartData: {
    name: string;
    total: number;
  }[];
}

export const useReports = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get<DashboardStatsResponse>('/reports/dashboard-stats');
      return data;
    },
    // Opcional: Refrescar los datos cada 5 minutos automáticamente
    staleTime: 1000 * 60 * 5, 
  });
};
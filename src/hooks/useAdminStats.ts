import { useQuery } from '@tanstack/react-query';
import { getAdminStats, type AdminGlobalStats } from '../api/admin.api'; // Ahora sí existe

export const useAdminStats = () => {
  return useQuery<AdminGlobalStats>({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
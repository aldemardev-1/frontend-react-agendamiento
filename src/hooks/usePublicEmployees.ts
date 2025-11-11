import { useQuery } from '@tanstack/react-query';
import { getPublicEmployees } from '../api/public.api';

export const usePublicEmployees = (userId: string) => {
  return useQuery({
    queryKey: ['publicEmployees', userId],
    queryFn: () => getPublicEmployees(userId),
    enabled: !!userId, // Solo ejecuta la query si hay un userId
  });
};

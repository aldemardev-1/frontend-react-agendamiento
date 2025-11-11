import { useQuery } from '@tanstack/react-query';
import { getPublicServices } from '../api/public.api';

export const usePublicServices = (userId: string) => {
  return useQuery({
    queryKey: ['publicServices', userId],
    queryFn: () => getPublicServices(userId),
    enabled: !!userId, // Solo ejecuta la query si hay un userId
  });
};

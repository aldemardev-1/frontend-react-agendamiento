import { useQuery } from '@tanstack/react-query';
import { getPublicAvailability } from '../api/public.api';

interface AvailabilityParams {
  date: string; // "yyyy-MM-dd"
  employeeId: string;
  serviceId: string;
}

export const usePublicAvailability = (params: AvailabilityParams) => {
  const { date, employeeId, serviceId } = params;

  return useQuery({
    queryKey: ['availability', date, employeeId, serviceId],
    queryFn: () => getPublicAvailability(params),
    // ¡IMPORTANTE! Esta query solo se ejecuta si TODOS los parámetros están presentes.
    enabled: !!date && !!employeeId && !!serviceId,
    staleTime: 1000 * 60, // 1 minuto de cache
  });
};

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCitas } from '../api/citas.api.ts';

// Opciones para el hook
interface UseCitasOptions {
  initialLimit?: number;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}

export const useCitas = (options: UseCitasOptions = {}) => {
  const { initialLimit = 50, startDate, endDate, employeeId } = options;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const queryKey = ['citas', page, limit, startDate, endDate, employeeId];

  const query = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      getCitas({
        page,
        limit,
        startDate,
        endDate,
        employeeId,
      }),
    placeholderData: keepPreviousData,
    // Refrescar cada 5 minutos
    staleTime: 1000 * 60 * 5, 
  });

  return {
    ...query,
    page,
    setPage,
    limit,
    setLimit,
  };
};

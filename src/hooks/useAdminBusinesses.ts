import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { getBusinesses, type GetBusinessesResponse } from '../api/admin.api';

const LIMIT = 10;

export const useAdminBusinesses = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  // Debounce de 500ms para no saturar el servidor mientras escribes
  const [debouncedSearch] = useDebounce(search, 500);

  // Clave única para caché: cambia si cambia la página o la búsqueda
  const queryKey = ['admin-businesses', page, debouncedSearch];

  const queryInfo = useQuery<GetBusinessesResponse>({
    queryKey: queryKey,
    queryFn: () => getBusinesses({ page, limit: LIMIT, search: debouncedSearch }),
    placeholderData: keepPreviousData, // Mantiene los datos viejos mientras cargan los nuevos
  });

  return {
    ...queryInfo, // Exporta data, isLoading, isError, refetch, etc.
    page,
    setPage,
    search,
    setSearch,
    limit: LIMIT
  };
};
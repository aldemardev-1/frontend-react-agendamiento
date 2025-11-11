import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { getBusinesses } from '../api/admin.api';

const LIMIT = 10;

export const useAdminBusinesses = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const queryKey = ['admin-businesses', page, debouncedSearch, LIMIT];

  // 1. No desestructurar aquí
  const queryInfo = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      getBusinesses({ page, limit: LIMIT, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  // 2. Devolver todo el objeto de query + los estados
  return {
    ...queryInfo, // <-- ¡CORRECCIÓN! (Esto incluye 'data', 'isLoading', 'refetch', etc.)
    page,
    setPage,
    search,
    setSearch,
  };
};
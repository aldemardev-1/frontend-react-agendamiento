import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { getClientes } from '../api/clients.api'; // Ajusta la ruta

const LIMIT = 10; // 10 clientes por página

export const useClientes = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const queryKey = ['clientes', page, debouncedSearch, LIMIT];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      getClientes({ page, limit: LIMIT, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    page,
    setPage,
    search,
    setSearch,
  };
};

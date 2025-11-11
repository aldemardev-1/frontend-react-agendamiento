// frontend/src/hooks/useServices.ts
import { useState } from 'react';
// 1. Importar 'keepPreviousData' y 'useQuery'
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { getServices } from '../api/services.api';

const LIMIT = 10; // 10 servicios por página

export const useServices = () => {
  // --- Estados para Paginación y Filtro ---
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // --- Debounce ---
  const [debouncedSearch] = useDebounce(search, 500);

  // --- TanStack Query ---
  const queryKey = ['services', page, debouncedSearch, LIMIT];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => getServices({ page, limit: LIMIT, search: debouncedSearch }),

    // 2. ¡LA CORRECCIÓN!
    //    'keepPreviousData: true' se reemplaza por:
    placeholderData: keepPreviousData,
  });

  // --- Retornamos todo lo que el componente necesita ---
  return {
    // Datos y estado de la query
    data,
    isLoading,
    isError,
    error,

    // Estado de paginación y sus 'setters'
    page,
    setPage,

    // Estado de búsqueda y su 'setter'
    search,
    setSearch,
  };
};
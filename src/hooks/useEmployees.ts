// frontend/src/hooks/useEmployees.ts
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { getEmployees } from '../api/employees.api';

const LIMIT = 9; // 9 empleados por página (para un grid de 3x3)

export const useEmployees = () => {
  // --- Estados para Paginación y Filtro ---
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // --- Debounce ---
  const [debouncedSearch] = useDebounce(search, 500);

  // --- TanStack Query ---
  const queryKey = ['employees', page, debouncedSearch, LIMIT];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => getEmployees({ page, limit: LIMIT, search: debouncedSearch }),
    
    // Mantiene los datos anteriores mientras cargan los nuevos
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
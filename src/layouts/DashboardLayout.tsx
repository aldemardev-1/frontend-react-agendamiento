import React from 'react';
// ¡CAMBIO! Importar NavLink en lugar de Link para estilos automáticos
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
// --- ¡NUEVO! Importar iconos para el layout ---
import {
  HomeIcon,
  CogIcon,
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const DashboardLayout: React.FC = () => {
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  // --- ¡NUEVO! Componente de enlace reutilizable ---
  const NavItem: React.FC<{ to: string; icon: React.ElementType; label: string }> = ({
    to,
    icon: Icon,
    label,
  }) => (
    <NavLink
      to={to}
      end={to === '/dashboard'} // 'end' es true solo para el Dashboard (ruta index)
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all
        ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg' // Estilo activo
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Estilo inactivo
        }`
      }
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* --- Barra Lateral (Sidebar) - ¡MEJORADA! --- */}
      <aside className="w-64 bg-white p-4 h-screen shadow-md hidden md:flex flex-col justify-between">
        <div>
          {/* Logo/Título del Negocio */}
          <div className="mb-6 p-3">
            <h1 className="text-2xl font-bold text-blue-700">Tu Agenda</h1>
            <span className="text-sm text-gray-500">Mi Negocio</span>
          </div>

          {/* Navegación */}
          <nav className="space-y-2">
            <NavItem to="/dashboard" icon={HomeIcon} label="Dashboard" />
            <NavItem
              to="/dashboard/servicios"
              icon={CogIcon}
              label="Servicios"
            />
            <NavItem
              to="/dashboard/empleados"
              icon={UsersIcon}
              label="Empleados"
            />
            {/* --- ¡AQUÍ ESTÁ EL NUEVO ENLACE! --- */}
            <NavItem
              to="/dashboard/clientes"
              icon={UserGroupIcon}
              label="Clientes"
            />
            <NavItem
              to="/dashboard/calendario"
              icon={CalendarIcon}
              label="Calendario"
            />
          </nav>
        </div>

        {/* Botón de Cerrar Sesión en Sidebar */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </aside>

      {/* --- Contenedor Principal (Derecha) --- */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Barra de Navegación Superior (para móvil y botón de logout) */}
        <header className="bg-white shadow p-4 flex justify-between items-center md:hidden">
          {/* Este botón puede abrir/cerrar un menú móvil si lo deseas */}
          <h1 className="text-xl font-bold text-blue-700">Tu Agenda</h1>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600"
            title="Cerrar Sesión"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Contenido Principal (con scroll) */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Aquí se renderizarán las páginas hijas */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

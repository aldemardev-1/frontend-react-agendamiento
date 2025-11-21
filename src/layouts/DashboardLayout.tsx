import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import {
  HomeIcon,
  BriefcaseIcon, // Icono nuevo para Servicios
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  LifebuoyIcon, // Icono nuevo para Configuración (Engranaje)
} from '@heroicons/react/24/outline';

const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user); // Traemos el usuario para mostrar la inicial

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  const NavItem: React.FC<{ 
    to: string; 
    icon: React.ElementType; 
    label: string; 
    onClick?: () => void 
  }> = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out
        ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
        }`
      }
    >
      <Icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </NavLink>
  );

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          {user?.businessName?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Tu Agenda</h1>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Panel de Control</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="space-y-1 flex-1">
        <NavItem 
          to="/dashboard" 
          icon={HomeIcon} 
          label="Dashboard" 
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
        />
        <NavItem 
          to="/dashboard/calendario" 
          icon={CalendarIcon} 
          label="Calendario" 
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
        />
        <NavItem 
          to="/dashboard/clientes" 
          icon={UserGroupIcon} 
          label="Clientes" 
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
        />
        <NavItem 
          to="/dashboard/empleados" 
          icon={UsersIcon} 
          label="Empleados" 
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
        />
        {/* CAMBIO: Servicios ahora usa BriefcaseIcon */}
        <NavItem 
          to="/dashboard/servicios" 
          icon={BriefcaseIcon} 
          label="Servicios" 
          onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
        />

        <div className="pt-4 mt-4 border-t border-gray-100">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Sistema
          </p>
          {/* NUEVO: Enlace a Configuración */}
          <NavItem 
            to="/dashboard/configuracion" 
            icon={Cog6ToothIcon} 
            label="Configuración" 
            onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
          />

           <NavItem 
            to="/dashboard/ayuda" 
            icon={LifebuoyIcon} 
            label="Ayuda y Soporte" 
            onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
          />
        </div>
      </nav>

      {/* Footer Sidebar */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 group"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 bg-white border-r border-gray-200 p-6 flex-col shadow-sm fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden
        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-2xl transform transition-transform duration-300 ease-out md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <SidebarContent isMobile={true} />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:pl-72">
        <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 flex justify-between items-center sticky top-0 z-30 md:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition-transform"
            >
              <Bars3Icon className="h-7 w-7" />
            </button>
            <span className="font-bold text-lg text-gray-800">
              {user?.name || 'Tu Agenda'}
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fadeIn">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
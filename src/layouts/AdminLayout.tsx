import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { 
  BuildingOffice2Icon, 
  ArrowRightOnRectangleIcon, 
  ChartBarIcon, 
  Bars3Icon,
  XMarkIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';

// CORRECCIÓN: Definimos la interfaz de las props
interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  // CORRECCIÓN: Usamos la interfaz aquí
  const NavItem = ({ to, icon: Icon, label, end = false, onClick }: NavItemProps) => (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
        ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </NavLink>
  );

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            SA
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Super Admin</h1>
        </div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider pl-11">Master Control</p>
      </div>

      <nav className="space-y-1 flex-1">
        <NavItem 
          to="/admin" 
          icon={BuildingOffice2Icon} 
          label="Negocios" 
          end={true}
          onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined}
        />
        <NavItem 
          to="/admin/stats" 
          icon={ChartBarIcon} 
          label="Métricas Globales"
          onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined}
        />
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800 space-y-2">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-all"
        >
          <ArrowUturnLeftIcon className="h-5 w-5" />
          <span className="font-medium text-sm">Ir a mi Negocio</span>
        </NavLink>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="hidden md:flex w-72 bg-slate-900 text-white p-6 flex-col shadow-xl fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      <div 
        className={`fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 md:hidden
        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 p-6 shadow-2xl transform transition-transform duration-300 ease-out md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <SidebarContent mobile={true} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:pl-72">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30 md:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <span className="font-bold text-lg text-slate-800">Super Admin</span>
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

export default AdminLayout;
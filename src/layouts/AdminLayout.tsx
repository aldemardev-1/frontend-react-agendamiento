import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { Building, LogOut, LayoutDashboard } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar del Super Admin */}
      <aside className="w-64 bg-gray-900 text-white p-4 h-screen shadow-md hidden md:flex flex-col justify-between">
        <div>
          <div className="mb-6 p-3">
            <h1 className="text-2xl font-bold text-white">Super Admin</h1>
            <span className="text-sm text-gray-400">Panel de Control</span>
          </div>

          <nav className="space-y-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`
              }
            >
              <Building className="h-5 w-5" />
              <span className="font-medium">Negocios</span>
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                }`
              }
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-medium">(Ir a mi Dashboard)</span>
            </NavLink>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-red-400 hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
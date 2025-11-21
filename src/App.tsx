import { Routes, Route } from 'react-router-dom';

// Páginas Públicas
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { Root } from './pages/Root'; // El redireccionador

// --- IMPORTAR LAYOUT PÚBLICO Y PÁGINA ---
import PublicLayout from './layouts/PublicLayout';
import { PublicBookingPage } from './pages/PublicBookingPage';

// Componentes de Rutas Protegidas
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import EmpleadosPage from './pages/EmpleadosPage';
import { EmployeeAvailabilityPage } from './pages/EmployeeAvailabilityPage';
import { ClientesPage } from './pages/ClientsPage'; 
import ServiciosPage from './pages/ServiciosPage';
import CalendarioPage from './pages/CalendarioPage';
import CancelPage from './pages/CancelPage';

// --- Componentes de Super Admin ---
import { SuperAdminRoute } from './components/auth/SuperAdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminBusinessesPage from './pages/AdminBusinessesPage';
import SettingsPage from './components/settings/SettingsPage';

function App() {
  return (
    <>
      <Routes>
        {/* --- RUTA RAÍZ --- */}
        <Route path="/" element={<Root />} />

        {/* --- RUTAS PÚBLICAS DE AUTENTICACIÓN --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- RUTAS PÚBLICAS DE RESERVA --- */}
        <Route element={<PublicLayout />}>
          <Route path="/:userId/book" element={<PublicBookingPage />} />
          <Route path="/cancel/:token" element={<CancelPage />} />
        </Route>

        {/* --- RUTAS PROTEGIDAS (OWNER DASHBOARD) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="servicios" element={<ServiciosPage />} />
            <Route path="empleados" element={<EmpleadosPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="configuracion" element={<SettingsPage />} />

            <Route
              path="empleados/:id/horario"
              element={<EmployeeAvailabilityPage />}
            />
            <Route path="calendario" element={<CalendarioPage />} />
          </Route>
        </Route>

        {/* --- RUTAS DE SUPER ADMIN --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SuperAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminBusinessesPage />} />
              {/* Futuras rutas: /admin/analytics, /admin/users, etc */}
              <Route path="stats" element={
                <div className="p-10 text-center">
                  <h2 className="text-2xl font-bold text-slate-700">Métricas Globales</h2>
                  <p className="text-slate-500">Próximamente...</p>
                </div>
              } />
            </Route>
          </Route>
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p>Página no encontrada</p>
                </div>
            </div>
        } />
      </Routes>
    </>
  );
}

export default App;
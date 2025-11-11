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
import { ClientesPage } from './pages/ClientsPage'; // Corregido de tu archivo
import ServiciosPage from './pages/ServiciosPage';
import CalendarioPage from './pages/CalendarioPage';
import CancelPage from './pages/CancelPage';

// --- ¡NUEVO! Importar componentes de Super Admin ---
import { SuperAdminRoute } from './components/auth/SuperAdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminBusinessesPage from './pages/AdminBusinessesPage';

function App() {
  return (
    <>
      <Routes>
        {/* --- RUTA RAÍZ --- */}
        <Route path="/" element={<Root />} />

        {/* --- RUTAS PÚBLICAS DE AUTENTICACIÓN --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- ¡NUEVO! RUTAS PÚBLICAS DE RESERVA --- */}
        {/* Usan un layout diferente (sin sidebar de admin) */}
        <Route element={<PublicLayout />}>
          {/* :userId es el ID del negocio (dueño) */}
          <Route path="/:userId/book" element={<PublicBookingPage />} />
          <Route path="/cancel/:token" element={<CancelPage />} />
        </Route>

        {/* --- RUTAS PROTEGIDAS (LAYOUT DEL DASHBOARD) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="servicios" element={<ServiciosPage />} />
            <Route path="empleados" element={<EmpleadosPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route
              path="empleados/:id/horario"
              element={<EmployeeAvailabilityPage />}
            />
            <Route path="calendario" element={<CalendarioPage />} />
          </Route>
        </Route>

        {/* --- ¡NUEVO! RUTAS DE SUPER ADMIN --- */}
        {/* 1. Primero verifica que esté logueado (ProtectedRoute) */}
        {/* 2. Luego verifica que sea SUPER_ADMIN (SuperAdminRoute) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SuperAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminBusinessesPage />} />
              {/* Aquí irían más rutas de admin, ej. /admin/stats */}
            </Route>
          </Route>
        </Route>

        {/* (Opcional) Ruta de "No Encontrado" 404 */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </>
  );
}

export default App;


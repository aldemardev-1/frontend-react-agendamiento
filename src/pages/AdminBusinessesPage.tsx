import { useAdminBusinesses } from '../hooks/useAdminBusinesses';
import { useAdminStats } from '../hooks/useAdminStats';
import { 
  MagnifyingGlassIcon, 
  // FunnelIcon, <-- ELIMINADO (No se usaba)
  ArrowPathIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// ... resto del archivo igual ...
// Asegúrate de copiar el resto del contenido del archivo anterior si no lo tienes a mano, 
// pero lo único que cambia es borrar esa línea del import.
const AdminBusinessesPage: React.FC = () => {
  const { 
    data: businessData, 
    isLoading: isLoadingTable, 
    isError, 
    refetch, 
    page, 
    setPage, 
    search, 
    setSearch 
  } = useAdminBusinesses();

  const { data: statsData, isLoading: isLoadingStats } = useAdminStats();

  const businesses = businessData?.data || [];
  const meta = businessData?.meta;
  const totalPages = meta?.totalPages || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  const StatCard = ({ title, value, icon: Icon, color, loading }: any) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
        {loading ? (
            <div className="h-8 w-20 bg-slate-100 animate-pulse rounded mt-1"></div>
        ) : (
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestionar Negocios</h1>
          <p className="text-slate-500 mt-1">Administra todos los clientes SaaS de tu plataforma.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm active:scale-95"
        >
            <ArrowPathIcon className={`h-4 w-4 ${isLoadingTable ? 'animate-spin' : ''}`} /> 
            Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Negocios" value={statsData?.totalBusinesses || 0} icon={BuildingStorefrontIcon} color="bg-blue-500" loading={isLoadingStats}/>
        <StatCard title="Citas Gestionadas" value={statsData?.totalCitas || 0} icon={CalendarDaysIcon} color="bg-indigo-500" loading={isLoadingStats}/>
        <StatCard title="Ingresos Totales" value={formatCurrency(statsData?.mrr || 0)} icon={CurrencyDollarIcon} color="bg-emerald-500" loading={isLoadingStats}/>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); 
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Negocio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Métricas</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Registro</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoadingTable && businesses.length === 0 ? (
                 <tr><td colSpan={5} className="text-center py-10 text-slate-500">Cargando...</td></tr>
              ) : null}
              {isError ? (
                 <tr><td colSpan={5} className="text-center py-10 text-red-500">Error al cargar datos.</td></tr>
              ) : null}
              {businesses.map((business) => (
                <tr key={business.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm">
                          {business.businessName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{business.businessName}</div>
                        <div className="text-sm text-slate-500">{business.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                      business.plan === 'FREE' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                      business.plan === 'PROFESIONAL' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-purple-100 text-purple-700 border-purple-200'
                    }`}>
                      {business.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1">👥 <b>{business._count?.employees || 0}</b> Empleados</span>
                        <span className="flex items-center gap-1">📅 <b>{business._count?.citas || 0}</b> Citas</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(business.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6 flex justify-between items-center">
            <p className="text-sm text-slate-500">
                Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex gap-2">
                <button onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={!hasPrevPage || isLoadingTable} className="px-3 py-1 border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50">Anterior</button>
                <button onClick={() => setPage(old => (hasNextPage ? old + 1 : old))} disabled={!hasNextPage || isLoadingTable} className="px-3 py-1 border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50">Siguiente</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBusinessesPage;
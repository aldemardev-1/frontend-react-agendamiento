import React from 'react';
// CORRECCIÓN: Importamos los nombres correctos de los iconos
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,   // Antes TrendingUpIcon
  ArrowTrendingDownIcon  // Antes TrendingDownIcon
} from '@heroicons/react/24/outline';

interface Props {
  income: number;
  growth: number;
  isLoading: boolean;
}

const FinancialStats: React.FC<Props> = ({ income, growth, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse" />
        <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse" />
      </div>
    );
  }

  const isPositive = growth >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Tarjeta de Ingresos Totales */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Ingresos este Mes</p>
          <h3 className="text-3xl font-bold text-gray-800">
            ${income.toLocaleString('es-CO')} {/* Formato moneda local */}
          </h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Tarjeta de Crecimiento */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Crecimiento vs Mes Anterior</p>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold text-gray-800">{growth}%</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPositive ? (
                <ArrowTrendingUpIcon className="h-3 w-3" />
              ) : (
                <ArrowTrendingDownIcon className="h-3 w-3" />
              )}
              {isPositive ? 'Subiendo' : 'Bajando'}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
          {isPositive ? (
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
          ) : (
            <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialStats;
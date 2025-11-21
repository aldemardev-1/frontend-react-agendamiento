import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../hooks/useProfile';
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
  const { data: profile, isLoading, updateProfileMutation } = useProfile();
  const { register, handleSubmit, setValue } = useForm();

  // Cargar datos existentes en el formulario
  useEffect(() => {
    if (profile) {
      setValue('businessName', profile.businessName);
      setValue('phone', profile.phone);
      setValue('address', profile.address);
      setValue('city', profile.city);
    }
  }, [profile, setValue]);

  const onSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) return <div>Cargando perfil...</div>;

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Configuración del Negocio</h2>
      <p className="text-gray-500 mb-8">Actualiza la información que verán tus clientes al reservar.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
              {profile?.businessName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{profile?.businessName}</h3>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          
          {/* Nombre del Negocio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de tu Negocio</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('businessName', { required: true })}
                type="text"
                className="block w-full pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 shadow-sm bg-gray-50 focus:bg-white transition-colors"
                placeholder="Ej: Barbería El Rey"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono / WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phone')}
                  type="tel"
                  className="block w-full pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 shadow-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GlobeAmericasIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('city')}
                  type="text"
                  className="block w-full pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 shadow-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Ej: Bogotá"
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección del Local</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('address')}
                type="text"
                className="block w-full pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 shadow-sm bg-gray-50 focus:bg-white transition-colors"
                placeholder="Ej: Calle 123 # 45-67"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
              {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
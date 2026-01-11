
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Service } from '../types';
import { Plus, Edit2, Trash2, ExternalLink, Eye } from 'lucide-react';

const Services: React.FC<{ navigate: (page: string, params?: any) => void }> = ({ navigate }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    const data = await apiService.services.getAll();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleStatus = async (id: string, current: boolean) => {
    await apiService.services.update(id, { enabled: !current });
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await apiService.services.delete(id);
      fetchServices();
    }
  };

  if (loading) return <div className="text-center py-20">Loading Services...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Offerings & Services</h1>
        <button 
          onClick={() => alert('Add Service Modal would open here.')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className={`bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-all ${!service.enabled && 'opacity-60 grayscale'}`}>
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full sm:w-48 h-48 object-cover cursor-pointer"
              onClick={() => navigate('service-detail', { id: service.id })}
            />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 
                  className="font-bold text-gray-900 text-lg cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate('service-detail', { id: service.id })}
                >
                  {service.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('service-detail', { id: service.id })} className="text-gray-400 hover:text-blue-600 p-1"><Eye size={16} /></button>
                  <button className="text-gray-400 hover:text-blue-600 p-1"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(service.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex-1">{service.description}</p>
              
              <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate('service-detail', { id: service.id })}
                    className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                  >
                    View Details <ExternalLink size={12} />
                  </button>
                  <button 
                    onClick={() => navigate('quotes')}
                    className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                  >
                    Get Quote <ExternalLink size={12} />
                  </button>
                </div>
                
                <button 
                  onClick={() => toggleStatus(service.id, service.enabled)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    service.enabled 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {service.enabled ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;

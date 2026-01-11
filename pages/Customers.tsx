
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { User } from '../types';
import { Search, Mail, ExternalLink } from 'lucide-react';

const Customers: React.FC<{ navigate: (page: string, params?: any) => void }> = ({ navigate }) => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.customers.getAll().then(data => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={`https://picsum.photos/seed/${c.id}/80/80`} 
                alt={c.name} 
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{c.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Mail size={12} /> {c.email}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-xs font-medium text-gray-400">Account ID: {c.id}</span>
              <button 
                onClick={() => navigate('customer-detail', { id: c.id })}
                className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                View Profile <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;

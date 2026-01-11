
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Lead } from '../types';
import { Trash2, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    const data = await apiService.leads.getAll();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    await apiService.leads.delete(id);
    fetchLeads();
  };

  const handleStatusChange = async (id: string, status: Lead['status']) => {
    await apiService.leads.updateStatus(id, status);
    fetchLeads();
  };

  if (loading) return <div className="text-center py-20">Loading leads...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contact Leads</h1>
        <div className="text-sm text-gray-500">{leads.length} entries found</div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                  <div className="flex flex-col gap-1 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail size={12}/> {lead.email}</span>
                    <span className="flex items-center gap-1"><Phone size={12}/> {lead.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{lead.message}</p>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-2 uppercase tracking-tight">
                    <Calendar size={10}/> {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                    className={`text-xs font-semibold rounded-full px-3 py-1 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleDelete(lead.id)}
                    className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;

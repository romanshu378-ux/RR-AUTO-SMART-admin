
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Inquiry, InquiryType, InquiryStatus } from '../types';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Search, 
  Filter, 
  Clock,
  MoreVertical,
  ArrowRight,
  ExternalLink,
  Trash2,
  Headphones,
  Eye
} from 'lucide-react';

interface InquiriesProps {
  userRole: 'admin' | 'customer';
  userId?: string;
  navigate: (page: string, params?: any) => void;
}

const Inquiries: React.FC<InquiriesProps> = ({ userRole, userId, navigate }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = userRole === 'admin' 
        ? await apiService.inquiries.getAll() 
        : await apiService.inquiries.getByUser(userId || '');
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 15000);
    return () => clearInterval(interval);
  }, [userRole, userId]);

  const handleStatusChange = async (e: React.MouseEvent, id: string, status: InquiryStatus) => {
    e.stopPropagation();
    await apiService.inquiries.updateStatus(id, status);
    fetchInquiries();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    await apiService.inquiries.delete(id);
    fetchInquiries();
  };

  const filtered = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inq.phone.includes(searchTerm);
    const matchesType = filterType === 'all' || inq.inquiryType === filterType;
    const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusStyle = (status: InquiryStatus) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in-progress': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'closed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: InquiryType) => {
    switch (type) {
      case 'call': return <Phone size={14} />;
      case 'message': return <MessageSquare size={14} />;
      case 'quote': return <ExternalLink size={14} />;
      default: return <Calendar size={14} />;
    }
  };

  if (loading && inquiries.length === 0) return <div className="text-center py-20 font-medium text-gray-500">Loading inquiries...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userRole === 'admin' ? 'Customer Inquiries' : 'My Requests'}</h1>
          <p className="text-sm text-gray-500">Track and manage service requests and inquiries</p>
        </div>
        
        {userRole === 'admin' && (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
            <Clock size={14} /> LIVE UPDATES
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="call">Call Requests</option>
            <option value="message">Messages</option>
            <option value="quote">Quotes</option>
            <option value="general">General</option>
          </select>
        </div>
        <div className="relative">
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="contacted">Contacted</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Requester</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Inquiry Info</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((inq) => (
              <tr 
                key={inq.id} 
                onClick={() => navigate('inquiry-detail', { id: inq.id })}
                className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                      {inq.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{inq.name}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Mail size={12}/> {inq.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-600 flex items-center gap-1 uppercase tracking-tighter">
                      {getTypeIcon(inq.inquiryType)} {inq.inquiryType}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1 italic max-w-xs">"{inq.message}"</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-[10px] font-bold rounded-full px-3 py-1 border uppercase tracking-wider ${getStatusStyle(inq.status)}`}>
                    {inq.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {userRole === 'admin' && (
                      <button 
                        onClick={(e) => handleDelete(e, inq.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Headphones size={40} className="text-gray-200" />
                    <p className="text-gray-500 font-medium">No inquiries found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inquiries;

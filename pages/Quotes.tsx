
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Quote, User } from '../types';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

const Quotes: React.FC<{ navigate: (page: string, params?: any) => void }> = ({ navigate }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [q, c] = await Promise.all([
      apiService.quotes.getAll(),
      apiService.customers.getAll()
    ]);
    setQuotes(q);
    setCustomers(c);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Unknown User';

  if (loading) return <div className="text-center py-20">Loading Quotes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quotes & Requests</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {quotes.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{getCustomerName(quote.customerId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{quote.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      quote.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      quote.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => navigate('quote-detail', { id: quote.id })}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FileText size={48} className="text-gray-200 mb-4" />
            <p className="text-lg font-medium">No pending quotes</p>
            <p className="text-sm">When customers request pricing, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;

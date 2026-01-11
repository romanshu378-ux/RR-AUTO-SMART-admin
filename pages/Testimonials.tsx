
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Testimonial } from '../types';
import { Star, Check, X, Trash2, Quote as QuoteIcon } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const data = await apiService.testimonials.getAll();
    setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id: string, approved: boolean) => {
    await apiService.testimonials.update(id, { approved });
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await apiService.testimonials.delete(id);
    fetch();
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.length === 0 ? (
           <div className="col-span-2 text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
             No testimonials recorded yet.
           </div>
        ) : testimonials.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <QuoteIcon className="absolute -top-2 -left-2 text-gray-50 opacity-50" size={80} />
            <div className="relative">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{t.author}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${t.approved ? 'text-green-500' : 'text-orange-500'}`}>
                    {t.approved ? 'Publicly Visible' : 'Pending Approval'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleApprove(t.id, !t.approved)}
                    className={`p-2 rounded-lg transition-colors ${t.approved ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                    aria-label={t.approved ? "Unapprove" : "Approve"}
                  >
                    {/* Fixed: Removed 'title' prop from Lucide components */}
                    {t.approved ? <X size={18} /> : <Check size={18} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;

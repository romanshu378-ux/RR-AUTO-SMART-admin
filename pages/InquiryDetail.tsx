
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Inquiry, InquiryStatus, User } from '../types';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Tag, 
  MessageSquare, 
  ArrowLeft,
  Briefcase,
  Star,
  CheckCircle,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  FileText,
  StickyNote,
  Send
} from 'lucide-react';

interface InquiryDetailProps {
  id: string;
  userRole: 'admin' | 'customer';
  navigate: (page: string, params?: any) => void;
}

const InquiryDetail: React.FC<InquiryDetailProps> = ({ id, userRole, navigate }) => {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [internalNote, setInternalNote] = useState('');
  const [notes, setNotes] = useState<{author: string, text: string, time: string}[]>([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const all = await apiService.inquiries.getAll();
      const found = all.find(i => i.id === id);
      setInquiry(found || null);
      
      // Load mock notes if admin
      if (userRole === 'admin') {
        setNotes([
          { author: 'System', text: 'Inquiry received via website form.', time: found?.createdAt || '' }
        ]);
      }
      setLoading(false);
    };
    fetch();
  }, [id, userRole]);

  const handleStatusUpdate = async (status: InquiryStatus) => {
    if (!inquiry) return;
    await apiService.inquiries.updateStatus(inquiry.id, status);
    setInquiry({ ...inquiry, status });
  };

  const handleAddNote = () => {
    if (!internalNote.trim()) return;
    setNotes([{ author: 'Admin', text: internalNote, time: new Date().toISOString() }, ...notes]);
    setInternalNote('');
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading inquiry context...</div>;
  if (!inquiry) return (
    <div className="bg-white p-20 rounded-2xl text-center shadow-sm border border-gray-100">
      <ShieldCheck size={48} className="mx-auto text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-900">Inquiry Not Found</h2>
      <button onClick={() => navigate('inquiries')} className="mt-4 text-blue-600 font-bold hover:underline flex items-center gap-2 justify-center">
        <ArrowLeft size={16} /> Return to list
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('inquiries')}
            className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Inquiry #{inquiry.id.slice(-4).toUpperCase()}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                inquiry.status === 'submitted' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                inquiry.status === 'in-progress' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                'bg-green-100 text-green-700 border-green-200'
              }`}>
                {inquiry.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">Submitted on {new Date(inquiry.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'admin' && (
            <>
              <button 
                onClick={() => alert('Converting to Quote...')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                <FileText size={18} /> Convert to Quote
              </button>
              <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-900 shadow-sm">
                <MoreVertical size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Data */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <UserCheck size={18} className="text-blue-600" /> Client Profile
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {inquiry.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">{inquiry.name}</h4>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">
                    {inquiry.userId ? 'Registered Customer' : 'Guest User'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                  <div className="p-2 bg-white rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-400">
                    <Phone size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Phone Number</p>
                    <p className="text-sm font-bold text-gray-900">{inquiry.phone}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </a>

                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                  <div className="p-2 bg-white rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-400">
                    <Mail size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{inquiry.email}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Tag size={18} className="text-purple-600" /> Request Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Inquiry Type</span>
                <span className="text-sm font-bold text-gray-900 capitalize">{inquiry.inquiryType}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Service Category</span>
                <span className="text-sm font-bold text-gray-900">Custom Automation</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Conversion</span>
                <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                  <Clock size={12} /> Pending Conversion
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Inquiry Content & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" /> Requirement / Message
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">Status Control:</span>
                {userRole === 'admin' ? (
                  <select 
                    value={inquiry.status}
                    onChange={(e) => handleStatusUpdate(e.target.value as InquiryStatus)}
                    className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="contacted">Contacted</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <span className="text-xs font-bold capitalize">{inquiry.status}</span>
                )}
              </div>
            </div>
            <div className="p-8 flex-1">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 relative">
                <Star className="absolute -top-3 -left-3 text-blue-500 fill-blue-500 opacity-20" size={40} />
                <p className="text-gray-800 leading-relaxed italic text-lg whitespace-pre-wrap">
                  "{inquiry.message}"
                </p>
              </div>

              {/* Activity Timeline */}
              <div className="mt-12">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Inquiry Lifecycle</h4>
                <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                  <div className="relative flex items-start gap-6">
                    <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-md flex items-center justify-center z-10">
                      <CheckCircle size={10} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Submitted</p>
                      <p className="text-xs text-gray-500">{new Date(inquiry.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {inquiry.status !== 'submitted' && (
                    <div className="relative flex items-start gap-6">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-md flex items-center justify-center z-10">
                        <Clock size={10} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Updated to {inquiry.status}</p>
                        <p className="text-xs text-gray-500">Processed by RR Admin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Internal Notes Section */}
            {userRole === 'admin' && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <StickyNote size={18} className="text-orange-500" />
                  <h4 className="text-sm font-bold text-gray-900">Internal Admin Notes</h4>
                </div>
                
                <div className="space-y-4 mb-4 max-h-40 overflow-y-auto pr-2">
                  {notes.map((note, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-blue-600 text-xs">{note.author}</span>
                        <span className="text-[10px] text-gray-400">{new Date(note.time).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-700">{note.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type an internal note..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleAddNote}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">* These notes are visible only to Admin staff.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;

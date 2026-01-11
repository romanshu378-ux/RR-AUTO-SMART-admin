
import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/apiService';
import { MediaFile } from '../types';
import { 
  Upload, 
  Trash2, 
  Search, 
  Layout, 
  Check, 
  X, 
  Maximize2, 
  CloudUpload,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

const WEBSITE_SLOTS = [
  { id: 'home-hero', label: 'Home Page Hero' },
  { id: 'about', label: 'About Us Section' },
  { id: 'services-banner', label: 'Services Main Banner' },
  { id: 'contact-bg', label: 'Contact Page Background' },
  { id: 'footer-logo', label: 'Footer Brand Logo' }
];

const MediaManager: React.FC = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState<string | null>(null); // mediaId

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    const data = await apiService.media.getAll();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await apiService.media.upload(files[i]);
      }
      fetchMedia();
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this image?')) return;
    await apiService.media.delete(id);
    fetchMedia();
  };

  const handleAssign = async (mediaId: string, slotId: string) => {
    await apiService.media.assign(mediaId, slotId);
    setIsAssigning(null);
    fetchMedia();
    alert(`Image assigned to ${WEBSITE_SLOTS.find(s => s.id === slotId)?.label}`);
  };

  const filteredMedia = media.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Manager</h1>
          <p className="text-sm text-gray-500">Manage your website assets and dynamic slots</p>
        </div>
        
        <div className="flex gap-2">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> : <Upload size={18} />}
            <span>Upload Assets</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by filename or section..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-sm font-medium">
          <ImageIcon size={16} />
          {media.length} Total Assets
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {/* Drop Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer bg-white group"
          >
            <CloudUpload size={32} className="group-hover:-translate-y-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Drop or Click</span>
          </div>

          {filteredMedia.map((m) => (
            <div key={m.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={m.url} 
                  alt={m.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => { setSelectedImage(m); setIsPreviewOpen(true); }}
                    className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white"
                  >
                    <Maximize2 size={18} />
                  </button>
                  <button 
                    onClick={() => setIsAssigning(m.id)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-lg"
                  >
                    <LinkIcon size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Status Badge */}
                {m.section && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded shadow-sm">
                    ACTIVE: {WEBSITE_SLOTS.find(s => s.id === m.section)?.label}
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <p className="text-xs font-bold text-gray-900 truncate" title={m.name}>{m.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-400 font-medium">{(m.size / 1024).toFixed(1)} KB</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{m.type.split('/')[1]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      {isAssigning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Replace Website Photo</h3>
              <button onClick={() => setIsAssigning(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-gray-500 mb-4">Choose where this image should be displayed on the public website:</p>
              {WEBSITE_SLOTS.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => handleAssign(isAssigning, slot.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                      <Layout size={18} className="text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <span className="font-semibold text-gray-700">{slot.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button className="absolute -top-12 right-0 text-white hover:text-gray-300 flex items-center gap-2">
              <X size={24} /> <span>Close</span>
            </button>
            <img 
              src={selectedImage.url} 
              alt="Preview" 
              className="max-h-[80vh] w-auto rounded-lg shadow-2xl border-4 border-white/10"
            />
            <div className="mt-6 text-center text-white">
              <p className="text-lg font-bold">{selectedImage.name}</p>
              <p className="text-sm text-gray-400">{selectedImage.type} • {(selectedImage.size/1024).toFixed(2)} KB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default MediaManager;

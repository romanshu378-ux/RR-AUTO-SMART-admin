
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  MessageSquare, 
  FileText, 
  Package, 
  Star,
  LogOut,
  Menu,
  ChevronLeft,
  Image as ImageIcon,
  Headphones
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
      ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  userRole: 'admin' | 'customer';
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage, onLogout, userRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiries', icon: Headphones },
    { id: 'leads', label: 'Leads', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'quotes', label: 'Quotes', icon: Star },
    { id: 'media', label: 'Media Manager', icon: ImageIcon },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      if (activePage.includes('-detail')) {
        setActivePage(activePage.split('-')[0] + 's');
      } else {
        setActivePage('dashboard');
      }
    } else {
      setActivePage('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform sidebar-transition
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 mb-8 cursor-pointer" onClick={() => setActivePage('dashboard')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">RR</div>
            <h1 className="text-xl font-bold tracking-tight">RR AUTO SMART</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activePage === item.id || activePage.startsWith(item.id.slice(0, -1))}
                onClick={() => {
                  setActivePage(item.id);
                  setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-100 mb-4">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Role: {userRole}</p>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-auto"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
               {activePage !== 'dashboard' && (
                 <button 
                  onClick={handleBack}
                  className="p-1 text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1 group"
                 >
                   <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                   <span className="text-sm font-medium hidden sm:inline">Back</span>
                 </button>
               )}
               <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
               <h2 className="text-lg font-semibold capitalize text-gray-900">{activePage.replace(/-/g, ' ')}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActivePage('messages')} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative">
               <MessageSquare size={20} />
               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => setActivePage('settings')} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
               <Settings size={20} />
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActivePage('settings')}>
              <img 
                src="https://picsum.photos/seed/admin/40/40" 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-gray-200 group-hover:border-blue-500 transition-colors"
              />
              <span className="hidden lg:inline-block text-sm font-bold text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

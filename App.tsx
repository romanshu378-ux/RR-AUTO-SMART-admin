
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { apiService } from './services/apiService';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Quotes from './pages/Quotes';
import Customers from './pages/Customers';
import Messages from './pages/Messages';
import Testimonials from './pages/Testimonials';
import Settings from './pages/Settings';
import Login from './pages/Login';
import MediaManager from './pages/MediaManager';
import Inquiries from './pages/Inquiries';
import InquiryDetail from './pages/InquiryDetail';

const ServiceDetail = ({ id, onBack }: { id: string, onBack: () => void }) => (
  <div className="bg-white p-8 rounded-xl border border-gray-200">
    <button onClick={onBack} className="mb-4 text-blue-600 flex items-center gap-2">← Back to Services</button>
    <h1 className="text-2xl font-bold">Service Details: {id}</h1>
    <p className="text-gray-500 mt-4">Full technical specifications and IoT configuration for this module would appear here.</p>
    <div className="mt-8 flex gap-4">
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Request a Quote</button>
      <button className="border border-gray-200 px-6 py-2 rounded-lg">Contact Expert</button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<'admin' | 'customer'>(
    (localStorage.getItem('role') as 'admin' | 'customer') || 'admin'
  );
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [pageParams, setPageParams] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const navigate = (page: string, params: any = null) => {
    setActivePage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const handleLogin = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const res = await apiService.auth.login(email, pass);
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.user.role);
      setCurrentUser(res.user);
      setUserRole(res.user.role);
      setIsAuthenticated(true);
      navigate('dashboard');
    } catch (err) {
      alert('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiService.auth.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} loading={loading} />;
  }

  const renderContent = () => {
    if (activePage === 'service-detail') return <ServiceDetail id={pageParams?.id} onBack={() => navigate('services')} />;
    if (activePage === 'inquiry-detail') return <InquiryDetail id={pageParams?.id} userRole={userRole} navigate={navigate} />;
    
    switch (activePage) {
      case 'dashboard': return <Dashboard navigate={navigate} />;
      case 'inquiries': return <Inquiries userRole={userRole} userId={currentUser?.id} navigate={navigate} />;
      case 'leads': return <Leads />;
      case 'projects': return <Projects navigate={navigate} />;
      case 'services': return <Services navigate={navigate} />;
      case 'quotes': return <Quotes navigate={navigate} />;
      case 'media': return <MediaManager />;
      case 'customers': return <Customers navigate={navigate} />;
      case 'messages': return <Messages />;
      case 'testimonials': return <Testimonials />;
      case 'settings': return <Settings />;
      default: return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <Layout 
      activePage={activePage} 
      setActivePage={navigate} 
      onLogout={handleLogout}
      userRole={userRole}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;

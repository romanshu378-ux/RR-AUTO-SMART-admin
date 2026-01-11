
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Lead, Project, Quote, Service, Activity } from '../types';
import { FileText, Briefcase, Star, Package, Clock, TrendingUp, ChevronRight } from 'lucide-react';

const StatCard: React.FC<{ icon: any, label: string, value: number | string, color: string, onClick: () => void }> = ({ icon: Icon, label, value, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left w-full group"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
      View Details <ChevronRight size={14} />
    </div>
  </button>
);

const Dashboard: React.FC<{ navigate: (page: string) => void }> = ({ navigate }) => {
  const [stats, setStats] = useState({
    leads: 0,
    projects: 0,
    services: 0,
    quotes: 0
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [l, p, s, q, act] = await Promise.all([
          apiService.leads.getAll(),
          apiService.projects.getAll(),
          apiService.services.getAll(),
          apiService.quotes.getAll(),
          apiService.activity.getRecent()
        ]);
        setStats({
          leads: l.length,
          projects: p.length,
          services: s.length,
          quotes: q.length
        });
        setRecentActivity(act);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">RR Performance Overview</h1>
        <p className="text-gray-500">Real-time monitoring of your RR AUTO SMART ecosystem</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard onClick={() => navigate('leads')} icon={FileText} label="Total Leads" value={stats.leads} color="bg-blue-50 text-blue-600" />
        <StatCard onClick={() => navigate('projects')} icon={Briefcase} label="Active Projects" value={stats.projects} color="bg-green-50 text-green-600" />
        <StatCard onClick={() => navigate('services')} icon={Package} label="Core Services" value={stats.services} color="bg-purple-50 text-purple-600" />
        <StatCard onClick={() => navigate('quotes')} icon={Star} label="Pending Quotes" value={stats.quotes} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <Clock size={18} className="text-gray-400" />
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((act, idx) => (
                  <li key={act.id}>
                    <div className="relative pb-8">
                      {idx !== recentActivity.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <TrendingUp className="text-white" size={14} />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {act.action} by <span className="font-medium text-gray-900">{act.user}</span>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-400">
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4">RR System Update</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              The RR AUTO SMART edge monitoring tools are now available for deployment. Optimize your automation projects today.
            </p>
          </div>
          <button 
            onClick={() => navigate('services')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors w-full sm:w-auto"
          >
            View Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

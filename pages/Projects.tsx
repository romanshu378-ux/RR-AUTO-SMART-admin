
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Project, User } from '../types';
import { Plus, MoreVertical, LayoutGrid, List } from 'lucide-react';

const Projects: React.FC<{ navigate: (page: string, params?: any) => void }> = ({ navigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<{id: string, label: string, color: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [p, c, s] = await Promise.all([
      apiService.projects.getAll(),
      apiService.customers.getAll(),
      apiService.settings.getStatuses()
    ]);
    setProjects(p);
    setCustomers(c);
    setStatuses(s);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusLabel = (id: string) => statuses.find(s => s.id === id);
  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Unknown';

  if (loading) return <div className="text-center py-20">Loading Projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">Managing {projects.length} active engagements</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${getStatusLabel(project.statusId)?.color}`}>
                  {getStatusLabel(project.statusId)?.label}
                </span>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-1">{project.title}</h3>
              <p className="text-sm text-blue-600 font-medium mb-4">{getCustomerName(project.customerId)}</p>
              
              <p className="text-sm text-gray-500 line-clamp-2 mb-6">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-600">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-medium">Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
              <button 
                onClick={() => navigate('project-detail', { id: project.id })}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

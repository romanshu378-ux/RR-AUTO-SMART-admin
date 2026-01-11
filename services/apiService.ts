
import { Lead, Service, Project, Quote, User, Message, Testimonial, AppSettings, Activity, MediaFile, Inquiry } from '../types';

const API_BASE = '/api';

const getStorage = <T,>(key: string, initial: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initial;
};

const setStorage = <T,>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123456789', message: 'Looking for smart lighting.', status: 'new', createdAt: new Date().toISOString() },
  { id: '2', name: 'Sarah Smith', email: 'sarah@office.com', phone: '987654321', message: 'Industrial IoT integration.', status: 'contacted', createdAt: new Date().toISOString() },
];

const MOCK_INQUIRIES: Inquiry[] = [
  { id: 'inq-1', name: 'Alex River', email: 'alex@river.com', phone: '+1 234 555 0101', inquiryType: 'call', message: 'Please call me about home security.', status: 'submitted', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'inq-2', name: 'Maria Garcia', email: 'm.garcia@tech.io', phone: '+1 234 555 0102', inquiryType: 'quote', message: 'Interested in smart parking sensors.', status: 'contacted', createdAt: new Date(Date.now() - 43200000).toISOString(), userId: 'c1' },
];

const MOCK_SERVICES: Service[] = [
  { id: 's1', title: 'Smart Home Hub', description: 'Centralized control for all your devices.', icon: 'Home', image: 'https://picsum.photos/400/300', enabled: true, learnMoreUrl: '/home', quoteUrl: '/quote' },
  { id: 's2', title: 'Industrial Monitoring', description: 'Predictive maintenance for heavy machinery.', icon: 'Activity', image: 'https://picsum.photos/400/301', enabled: true, learnMoreUrl: '/ind', quoteUrl: '/quote' },
];

const MOCK_PROJECTS: Project[] = [
  { id: 'p1', title: 'City Hospital Automation', customerId: 'c1', statusId: 'in-progress', progress: 65, description: 'Automating HVAC systems.', updatedAt: new Date().toISOString() },
];

const MOCK_USERS: User[] = [
  { id: 'c1', name: 'Acme Corp', email: 'billing@acme.com', role: 'customer' },
  { id: 'admin-1', name: 'RR Admin', email: 'admin@rrautosmart.io', role: 'admin' }
];

const MOCK_MEDIA: MediaFile[] = [
  { id: 'm1', name: 'Hero Banner', url: 'https://picsum.photos/1200/800?1', size: 102400, type: 'image/jpeg', section: 'home-hero', createdAt: new Date().toISOString() },
  { id: 'm2', name: 'About Image', url: 'https://picsum.photos/600/400?2', size: 51200, type: 'image/jpeg', section: 'about', createdAt: new Date().toISOString() },
];

export const apiService = {
  auth: {
    login: async (email: string, pass: string): Promise<{ token: string; user: User }> => {
      await new Promise(r => setTimeout(r, 800));
      const user = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[1];
      return { token: 'mock-jwt-token', user };
    },
    getProfile: async (): Promise<User> => {
      return MOCK_USERS[1];
    },
    logout: async () => true
  },

  inquiries: {
    getAll: async (): Promise<Inquiry[]> => getStorage('inquiries', MOCK_INQUIRIES),
    getByUser: async (userId: string): Promise<Inquiry[]> => {
      const all = getStorage('inquiries', MOCK_INQUIRIES);
      return all.filter(inq => inq.userId === userId);
    },
    submit: async (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
      const current = getStorage('inquiries', MOCK_INQUIRIES);
      const newInq: Inquiry = {
        ...inquiry,
        id: `inq-${Date.now()}`,
        status: 'submitted',
        createdAt: new Date().toISOString()
      };
      setStorage('inquiries', [...current, newInq]);
      return newInq;
    },
    updateStatus: async (id: string, status: Inquiry['status']) => {
      const current = getStorage('inquiries', MOCK_INQUIRIES);
      setStorage('inquiries', current.map(i => i.id === id ? { ...i, status } : i));
    },
    delete: async (id: string) => {
      const current = getStorage('inquiries', MOCK_INQUIRIES);
      setStorage('inquiries', current.filter(i => i.id !== id));
    }
  },

  leads: {
    getAll: async (): Promise<Lead[]> => getStorage('leads', MOCK_LEADS),
    delete: async (id: string) => {
      const current = getStorage('leads', MOCK_LEADS);
      setStorage('leads', current.filter(l => l.id !== id));
    },
    updateStatus: async (id: string, status: Lead['status']) => {
      const current = getStorage('leads', MOCK_LEADS);
      setStorage('leads', current.map(l => l.id === id ? { ...l, status } : l));
    }
  },

  services: {
    getAll: async (): Promise<Service[]> => getStorage('services', MOCK_SERVICES),
    create: async (s: Omit<Service, 'id'>) => {
      const current = getStorage('services', MOCK_SERVICES);
      const newItem = { ...s, id: Math.random().toString(36).substr(2, 9) };
      setStorage('services', [...current, newItem]);
    },
    update: async (id: string, s: Partial<Service>) => {
      const current = getStorage('services', MOCK_SERVICES);
      setStorage('services', current.map(item => item.id === id ? { ...item, ...s } : item));
    },
    delete: async (id: string) => {
      const current = getStorage('services', MOCK_SERVICES);
      setStorage('services', current.filter(item => item.id !== id));
    }
  },

  projects: {
    getAll: async (): Promise<Project[]> => getStorage('projects', MOCK_PROJECTS),
    create: async (p: Omit<Project, 'id'>) => {
      const current = getStorage('projects', MOCK_PROJECTS);
      const newItem = { ...p, id: `p${Date.now()}` };
      setStorage('projects', [...current, newItem]);
    },
    updateStatus: async (id: string, statusId: string) => {
      const current = getStorage('projects', MOCK_PROJECTS);
      setStorage('projects', current.map(p => p.id === id ? { ...p, statusId, updatedAt: new Date().toISOString() } : p));
    }
  },

  quotes: {
    getAll: async (): Promise<Quote[]> => getStorage('quotes', []),
    updateStatus: async (id: string, status: Quote['status']) => {
      const current = getStorage<Quote[]>('quotes', []);
      setStorage('quotes', current.map(q => q.id === id ? { ...q, status } : q));
    }
  },

  customers: {
    getAll: async (): Promise<User[]> => MOCK_USERS.filter(u => u.role === 'customer'),
  },

  messages: {
    getAll: async (): Promise<Message[]> => getStorage('messages', []),
    send: async (msg: Omit<Message, 'id' | 'timestamp'>) => {
      const current = getStorage<Message[]>('messages', []);
      const newMsg = { ...msg, id: Date.now().toString(), timestamp: new Date().toISOString() };
      setStorage('messages', [...current, newMsg]);
    }
  },

  testimonials: {
    getAll: async (): Promise<Testimonial[]> => getStorage('testimonials', []),
    create: async (t: Omit<Testimonial, 'id'>) => {
      const current = getStorage<Testimonial[]>('testimonials', []);
      setStorage('testimonials', [...current, { ...t, id: Date.now().toString() }]);
    },
    update: async (id: string, data: Partial<Testimonial>) => {
      const current = getStorage<Testimonial[]>('testimonials', []);
      setStorage('testimonials', current.map(t => t.id === id ? { ...t, ...data } : t));
    },
    delete: async (id: string) => {
      const current = getStorage<Testimonial[]>('testimonials', []);
      setStorage('testimonials', current.filter(t => t.id !== id));
    }
  },

  settings: {
    get: async (): Promise<AppSettings> => getStorage('settings', {
      companyName: 'RR AUTO SMART',
      contactEmail: 'contact@rrautosmart.io',
      phone: '+1 555-0800',
      address: 'Industrial District, HQ',
      maintenanceMode: false
    }),
    update: async (s: AppSettings) => setStorage('settings', s),
    getStatuses: async () => [
      { id: 'planning', label: 'Planning', color: 'bg-blue-100 text-blue-700' },
      { id: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' },
      { id: 'testing', label: 'Testing', color: 'bg-purple-100 text-purple-700' },
      { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
      { id: 'on-hold', label: 'On Hold', color: 'bg-red-100 text-red-700' },
    ]
  },

  media: {
    getAll: async (): Promise<MediaFile[]> => getStorage('media_files', MOCK_MEDIA),
    upload: async (file: File): Promise<MediaFile> => {
      await new Promise(r => setTimeout(r, 1200));
      const current = getStorage('media_files', MOCK_MEDIA);
      const newFile: MediaFile = {
        id: `m${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file), // Mock URL for demo
        size: file.size,
        type: file.type,
        createdAt: new Date().toISOString()
      };
      setStorage('media_files', [...current, newFile]);
      return newFile;
    },
    assign: async (id: string, section: string) => {
      const current = getStorage('media_files', MOCK_MEDIA);
      setStorage('media_files', current.map(m => m.id === id ? { ...m, section } : m));
    },
    delete: async (id: string) => {
      const current = getStorage('media_files', MOCK_MEDIA);
      setStorage('media_files', current.filter(m => m.id !== id));
    }
  },

  activity: {
    getRecent: async (): Promise<Activity[]> => [
      { id: '1', user: 'Admin', action: 'Approved project "Smart Fleet"', timestamp: new Date().toISOString() },
      { id: '2', user: 'System', action: 'New lead received: John Doe', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ]
  }
};


import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { AppSettings } from '../types';
import { Save, Building2, Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiService.settings.get().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    await apiService.settings.update(settings);
    setSaving(false);
    alert('Settings updated successfully!');
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Settings</h1>
        <p className="text-gray-500">Configure global parameters and branding for Nexus IoT</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Building2 size={20} className="text-blue-500" /> Company Profile
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Display Name</label>
              <input 
                type="text" 
                value={settings.companyName}
                onChange={e => setSettings({...settings, companyName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" 
                  value={settings.contactEmail}
                  onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Public Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={settings.phone}
                  onChange={e => setSettings({...settings, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Headquarters Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={settings.address}
                  onChange={e => setSettings({...settings, address: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert size={20} className="text-red-500" /> Advanced Control
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Temporarily disable public access to the client portal.</p>
              </div>
              <button 
                type="button"
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

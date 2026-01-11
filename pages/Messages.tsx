
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Message, User } from '../types';
import { Send, User as UserIcon } from 'lucide-react';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [m, c] = await Promise.all([
        apiService.messages.getAll(),
        apiService.customers.getAll()
      ]);
      setMessages(m);
      setCustomers(c);
      if (c.length > 0) setSelectedCustomer(c[0].id);
      setLoading(false);
    };
    load();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedCustomer) return;
    await apiService.messages.send({
      senderId: 'admin-1',
      receiverId: selectedCustomer,
      content: inputText
    });
    setInputText('');
    setMessages(await apiService.messages.getAll());
  };

  const filteredMessages = messages.filter(m => 
    (m.senderId === selectedCustomer && m.receiverId === 'admin-1') ||
    (m.senderId === 'admin-1' && m.receiverId === selectedCustomer)
  );

  if (loading) return <div className="text-center py-20">Loading messages...</div>;

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Sidebar - Customer List */}
      <div className="w-full sm:w-72 border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-900">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {customers.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCustomer(c.id)}
              className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                selectedCustomer === c.id ? 'bg-blue-50 border-r-4 border-blue-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <UserIcon size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-500 truncate">{c.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/50">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
              No messages yet. Send a greeting!
            </div>
          ) : (
            filteredMessages.map(m => (
              <div key={m.id} className={`flex ${m.senderId === 'admin-1' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  m.senderId === 'admin-1' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'
                }`}>
                  <p>{m.content}</p>
                  <p className={`text-[10px] mt-1 ${m.senderId === 'admin-1' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..." 
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

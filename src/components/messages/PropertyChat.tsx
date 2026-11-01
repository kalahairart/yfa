import React, { useState } from 'react';
import { ChatThread, ThemeSettings, ChatMessage } from '../../types/property';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  CheckCheck, 
  Building2,
  Clock
} from 'lucide-react';

interface PropertyChatProps {
  threads: ChatThread[];
  settings: ThemeSettings;
}

export const PropertyChat: React.FC<PropertyChatProps> = ({
  threads: initialThreads,
  settings,
}) => {
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>(initialThreads[0]?.id || 'th-1');
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter(
    (t) =>
      t.contactName.toLowerCase().includes(search.toLowerCase()) ||
      t.propertyTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'admin',
      senderName: 'Lahomes Concierge',
      senderAvatar: '/src/assets/images/avatar_agent_male_1792833743569.jpg',
      text: inputText.trim(),
      timestamp: 'Just now',
      isSelf: true,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: inputText.trim(),
            timestamp: 'Just now',
            messages: [...t.messages, newMessage],
          };
        }
        return t;
      })
    );

    setInputText('');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {settings.language === 'id' ? 'Aplikasi Chat & Pertanyaan Pembeli' : 'Inquiries & Live Chat Portal'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {settings.language === 'id' 
            ? 'Pusat komunikasi langsung antara agen konsultan dan calon pembeli' 
            : 'Real-time communication suite connecting licensed brokers with VIP prospects'}
        </p>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden h-[620px] flex flex-col md:flex-row">
        {/* Left Side: Threads List */}
        <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          {/* Search */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={settings.language === 'id' ? 'Cari percakapan...' : 'Search threads...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Threads scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredThreads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    isActive
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-l-4 border-l-emerald-600'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <img
                    src={thread.contactAvatar}
                    alt={thread.contactName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {thread.contactName}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                        {thread.timestamp}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">
                      {thread.propertyTitle}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {thread.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Conversation Window */}
        {activeThread ? (
          <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Thread Header */}
            <div className="p-3.5 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <img
                  src={activeThread.contactAvatar}
                  alt={activeThread.contactName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{activeThread.contactName}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-500 dark:text-slate-400">{activeThread.contactRole}</span>
                    <span>·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[200px]">
                      {activeThread.propertyTitle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert(`Calling ${activeThread.contactName}...`)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isSelf && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                  )}
                  <div className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-xs ${
                    msg.isSelf
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                      msg.isSelf ? 'text-emerald-100' : 'text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {msg.isSelf && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Attach Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={settings.language === 'id' ? 'Ketik tanggapan pesan properti...' : 'Type a real estate message...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            {settings.language === 'id' ? 'Pilih percakapan untuk memulai' : 'Select a thread to view conversation'}
          </div>
        )}
      </div>
    </div>
  );
};

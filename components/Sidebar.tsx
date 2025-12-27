
import React from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  ShieldAlert, 
  Terminal, 
  Settings,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  status: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, status }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.EDITOR, label: 'Script Editor', icon: Code2 },
    { id: AppView.SECURITY, label: 'Security Suite', icon: ShieldAlert },
    { id: AppView.LOGS, label: 'System Logs', icon: Terminal },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col glass shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg glow-blue group cursor-pointer overflow-hidden">
          <Zap size={20} className="text-white group-hover:scale-110 transition-transform" fill="currentColor" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tighter text-white">BLUEPRINT</h1>
          <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em]">SUPREMO</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-500' : 'group-hover:text-zinc-300'} />
              <span className="text-sm font-semibold tracking-tight">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-6 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Protection</span>
          <ShieldCheck size={14} className="text-green-500" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">Byfron Bypass</span>
            <span className="text-[11px] text-green-500 font-mono">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">Kernel Hook</span>
            <span className="text-[11px] text-zinc-600 font-mono">READY</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-blue-600 w-full animate-[pulse_2s_infinite]" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

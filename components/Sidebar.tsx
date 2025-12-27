
import React from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  ShieldAlert, 
  Terminal, 
  Zap,
  Package
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.EDITOR, label: 'Editor', icon: Code2 },
    { id: AppView.SECURITY, label: 'Security', icon: ShieldAlert },
    { id: AppView.PLUGINS, label: 'Plugins', icon: Package },
    { id: AppView.LOGS, label: 'Logs', icon: Terminal },
  ];

  return (
    <aside className="w-56 border-r border-white/5 flex flex-col bg-[#0b0b0d] shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" fill="currentColor" />
        </div>
        <h1 className="font-black text-sm tracking-tight text-white uppercase italic">Flux Core</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={16} />
              <span className="text-xs font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-lg bg-zinc-900/50 border border-white/5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold text-zinc-600 uppercase">Protection</span>
        </div>
        <div className="text-[10px] text-green-500/80 font-mono">ENCRYPTED LINK</div>
      </div>
    </aside>
  );
};

export default Sidebar;

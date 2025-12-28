
import React from 'react';
import { Shield, Minus, Square, X } from 'lucide-react';

const TitleBar: React.FC = () => {
  return (
    <div className="h-9 bg-black/50 border-b border-white/5 flex items-center justify-between px-3 titlebar-drag select-none z-50">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-cyan-500" fill="currentColor" fillOpacity={0.2} />
        <span className="text-xs font-bold tracking-wider text-gray-200">
          FLUX CORE <span className="text-cyan-500">NEXUS</span> <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 ml-1">v4.1 GOD MODE</span>
        </span>
      </div>
      
      <div className="flex gap-1 no-drag">
        <button onClick={() => window.fluxAPI.minimize()} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
          <Minus className="w-3 h-3" />
        </button>
        <button onClick={() => window.fluxAPI.toggleMaximize()} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
          <Square className="w-3 h-3" />
        </button>
        <button onClick={() => window.fluxAPI.close()} className="p-1.5 hover:bg-red-500 hover:text-white rounded-md text-gray-400 transition-colors">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;

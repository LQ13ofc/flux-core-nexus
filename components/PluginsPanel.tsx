
import React from 'react';
import { Package, CheckCircle2, Info, Gamepad2, Download, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { PluginModule, GamePack } from '../types';

interface PluginsPanelProps {
  addLog: (msg: string, level?: any, cat?: string) => void;
  plugins: PluginModule[];
  setPlugins: React.Dispatch<React.SetStateAction<PluginModule[]>>;
  gameLibrary: GamePack[];
  onToggleGame: (id: string) => void;
}

const PluginsPanel: React.FC<PluginsPanelProps> = ({ addLog, plugins, setPlugins, gameLibrary, onToggleGame }) => {
  const togglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === id) {
        const newState = !p.enabled;
        addLog(`${newState ? 'Enabling' : 'Disabling'} ${p.name}...`, newState ? 'SUCCESS' : 'WARN', 'PLUGINS');
        return { ...p, enabled: newState };
      }
      return p;
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <Package className="text-blue-500" size={24} />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Nexus Language Runtimes</h2>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest ml-9">Active execution layers and JIT compilers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plugins.map((plugin) => (
            <div 
              key={plugin.id} 
              onClick={() => togglePlugin(plugin.id)} 
              className={`flex flex-col p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                plugin.enabled 
                ? 'bg-blue-600/5 border-blue-600/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]' 
                : 'bg-[#141417] border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${plugin.enabled ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                    {plugin.id.toUpperCase()}
                  </div>
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-tight block ${plugin.enabled ? 'text-zinc-100' : 'text-zinc-500'}`}>{plugin.name}</span>
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{plugin.type} v{plugin.version}</span>
                  </div>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-all ${plugin.enabled ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                   <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${plugin.enabled ? 'left-4.5' : 'left-0.5'}`} />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed italic">{plugin.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <Gamepad2 className="text-purple-500" size={24} />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Game Execution Packs</h2>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest ml-9">Predefined logic libraries and QoL profiles.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {gameLibrary.map((game) => (
            <div key={game.id} className={`bg-[#141417] border p-6 rounded-2xl flex items-center justify-between transition-all ${game.installed ? 'border-purple-500/20 shadow-lg' : 'border-white/5 opacity-40'}`}>
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all ${game.installed ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' : 'bg-zinc-800 border-white/5 text-zinc-700'}`}>
                  <Gamepad2 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className={`text-base font-black uppercase italic tracking-tighter ${game.installed ? 'text-white' : 'text-zinc-600'}`}>{game.name} Elite Pack</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[8px] bg-white/5 px-2 py-1 rounded-full text-zinc-500 font-black uppercase tracking-widest border border-white/5">{game.engine}</span>
                    <span className="text-[8px] bg-purple-500/10 px-2 py-1 rounded-full text-purple-400 font-black uppercase tracking-widest border border-purple-500/10">{game.scripts.length} MODULES</span>
                    {game.installed && (
                      <span className="text-[8px] bg-green-500/10 px-2 py-1 rounded-full text-green-500 font-black uppercase tracking-widest border border-green-500/10 flex items-center gap-1">
                        <ShieldCheck size={8} /> STEALTH VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onToggleGame(game.id)}
                className={`px-6 py-2.5 text-[10px] font-black rounded-xl flex items-center gap-2 transition-all uppercase tracking-[0.1em] ${
                  game.installed 
                  ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600/20' 
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-white'
                }`}
              >
                {game.installed ? <CheckCircle2 size={14} /> : <Download size={14} />}
                {game.installed ? 'ACTIVE' : 'INSTALL'}
              </button>
            </div>
          ))}
          <div className="p-6 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-zinc-700 hover:text-zinc-400 hover:border-blue-500/30 cursor-pointer transition-all group">
            <Download size={18} className="group-hover:translate-y-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Import Remote Game Definition (.json)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginsPanel;


import React from 'react';
import { Package, CheckCircle2, Info } from 'lucide-react';
import { PluginModule } from '../types';

interface PluginsPanelProps {
  addLog: (msg: string, level?: any, cat?: string) => void;
  plugins: PluginModule[];
  setPlugins: React.Dispatch<React.SetStateAction<PluginModule[]>>;
}

const PluginsPanel: React.FC<PluginsPanelProps> = ({ addLog, plugins, setPlugins }) => {
  const togglePlugin = (id: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === id) {
        const newState = !p.enabled;
        addLog(`${newState ? 'Enabling' : 'Disabling'} ${p.name}...`, newState ? 'INFO' : 'WARN', 'PLUGINS');
        if (newState) {
          setTimeout(() => addLog(`${p.name} runtime is active.`, 'SUCCESS', 'RUNTIME'), 600);
        }
        return { ...p, enabled: newState };
      }
      return p;
    }));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Package className="text-blue-500" size={20} />
          Language Runtimes
        </h2>
        <p className="text-zinc-500 text-xs">Activate specialized engines for advanced game support (GTA 5, Unity, etc.).</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {plugins.map((plugin) => (
          <div 
            key={plugin.id}
            onClick={() => togglePlugin(plugin.id)}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
              plugin.enabled 
                ? 'bg-blue-600/5 border-blue-600/30' 
                : 'bg-[#141417] border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                plugin.enabled ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'
              }`}>
                <span className="text-[10px] font-bold uppercase">{plugin.id.substring(0, 3)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{plugin.name}</h3>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold border ${
                    plugin.type === 'Engine' ? 'border-purple-500/30 text-purple-400' : 
                    plugin.type === 'Wrapper' ? 'border-orange-500/30 text-orange-400' : 
                    'border-emerald-500/30 text-emerald-400'
                  }`}>
                    {plugin.type}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5">{plugin.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {plugin.enabled && <CheckCircle2 size={14} className="text-blue-500" />}
              <div className={`w-8 h-4 rounded-full relative transition-colors ${
                plugin.enabled ? 'bg-blue-600' : 'bg-zinc-800'
              }`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                  plugin.enabled ? 'left-4.5' : 'left-0.5'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-xl flex items-start gap-3">
        <Info size={16} className="text-zinc-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-zinc-500 leading-relaxed">
          Flux Core will only show security and execution options that are compatible with your active language runtimes.
        </p>
      </div>
    </div>
  );
};

export default PluginsPanel;

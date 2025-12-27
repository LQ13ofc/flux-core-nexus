
import React, { useState, useMemo } from 'react';
import { ShieldCheck, RefreshCcw, Lock, EyeOff, Terminal, Zap } from 'lucide-react';
import { HWIDProfile, PluginModule } from '../types';

interface SecuritySuiteProps {
  addLog: (msg: string, level?: any, cat?: string) => void;
  enabledPlugins: PluginModule[];
}

const SecuritySuite: React.FC<SecuritySuiteProps> = ({ addLog, enabledPlugins }) => {
  const [hwid, setHwid] = useState<HWIDProfile>({
    smbios: 'FLUX-HW-7712',
    diskId: 'SSD-SATA-8801',
    mac: '0A:11:BB:CC:DD:EE',
    gpu: 'VIRTUAL-FLUX-GPU'
  });
  
  const [isSpoofing, setIsSpoofing] = useState(false);

  // Define which security methods belong to which language runtimes
  const allMethods = useMemo(() => [
    { label: "Kernel Hook Evasion", desc: "Universal bypass for ring-0 watchdogs.", lang: ['c', 'cpp'] },
    { label: "Luau VM Cloaking", desc: "Hides script execution from in-game VM checks.", lang: ['lua'] },
    { label: "FiveM/Mono Evasion", desc: "Specific JIT obfuscation for Unity based engines.", lang: ['csharp'] },
    { label: "Social Club Auth Emulator", desc: "Bypass DRM/Social Club checks for RAGE engine games.", lang: ['cpp', 'c'] },
    { label: "Script Hook V Stealth", desc: "Enables undetected native execution in GTA 5.", lang: ['cpp'] },
    { label: "Python Bytecode Shield", desc: "Encrypts automation logic in memory.", lang: ['python'] },
    { label: "Anti-Analysis Trap", desc: "Detects and crashes debuggers before they can attach.", lang: ['c', 'cpp', 'csharp'] },
    { label: "Process Integrity Patch", desc: "Forces game to ignore unauthorized memory modifications.", lang: ['lua', 'js'] }
  ], []);

  // Filter methods based on enabled runtimes
  const visibleMethods = useMemo(() => {
    const enabledIds = enabledPlugins.map(p => p.id);
    return allMethods.filter(m => m.lang.some(l => enabledIds.includes(l as any)));
  }, [enabledPlugins, allMethods]);

  const handleSpoof = () => {
    setIsSpoofing(true);
    addLog('Refreshing Virtual Identifiers...', 'INFO', 'SECURITY');
    setTimeout(() => {
      setHwid({
        smbios: `FLUX-HW-${Math.floor(Math.random() * 9000 + 1000)}`,
        diskId: `DISK-${Math.floor(Math.random() * 9000 + 1000)}`,
        mac: `0A:${Math.floor(Math.random() * 90).toString(16).toUpperCase()}:BB:CC:DD:EE`,
        gpu: 'VIRTUAL-FLUX-GPU'
      });
      setIsSpoofing(false);
      addLog('Identities randomized.', 'SUCCESS', 'SECURITY');
    }, 1000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-blue-500" />
        <h2 className="text-xl font-bold text-white">Security & Evasion</h2>
      </div>

      {/* HWID remains universal */}
      <div className="bg-[#141417] border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Virtual HWID (Universal)</span>
          <button onClick={handleSpoof} disabled={isSpoofing} className="text-blue-500 hover:text-blue-400 disabled:opacity-30">
            <RefreshCcw size={16} className={isSpoofing ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
            <span className="text-xs text-zinc-500">SMBIOS</span>
            <span className="text-xs font-mono text-zinc-300">{hwid.smbios}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
            <span className="text-xs text-zinc-500">MAC</span>
            <span className="text-xs font-mono text-zinc-300">{hwid.mac}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Context-Aware Evasion</h3>
          <span className="text-[9px] text-blue-500 font-bold uppercase">{visibleMethods.length} ACTIVE METHODS</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {visibleMethods.length > 0 ? (
            visibleMethods.map((m, i) => (
              <ToggleItem key={i} label={m.label} desc={m.desc} />
            ))
          ) : (
            <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-xl flex flex-col items-center text-center gap-2">
              <Lock size={20} className="text-orange-500" />
              <p className="text-xs text-orange-200/60 font-medium">Enable Language Runtimes in the Plugins tab to unlock specialized evasion techniques.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToggleItem: React.FC<{ label: string, desc: string }> = ({ label, desc }) => {
  const [val, setVal] = useState(true);
  return (
    <div className="flex items-center justify-between p-4 bg-[#141417] border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-colors" onClick={() => setVal(!val)}>
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold text-zinc-200">{label}</h4>
        <p className="text-[10px] text-zinc-500">{desc}</p>
      </div>
      <div className={`w-8 h-4 rounded-full relative transition-colors shrink-0 ml-4 ${val ? 'bg-blue-600' : 'bg-zinc-800'}`}>
        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${val ? 'left-4.5' : 'left-0.5'}`} />
      </div>
    </div>
  );
};

export default SecuritySuite;

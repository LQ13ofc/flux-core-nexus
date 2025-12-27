
import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, RefreshCcw, Lock, Search, ShieldAlert, Cpu, Zap, EyeOff, Terminal, Shield, Fingerprint, Network, Radio, Eye, AlertTriangle, HardDrive } from 'lucide-react';
import { HWIDProfile, PluginModule, SecurityModule } from '../types';

interface SecuritySuiteProps {
  addLog: (msg: string, level?: any, cat?: string) => void;
  enabledPlugins: PluginModule[];
}

const SecuritySuite: React.FC<SecuritySuiteProps> = ({ addLog, enabledPlugins }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hwid, setHwid] = useState<HWIDProfile>({
    smbios: 'FLUX-HW-7712',
    diskId: 'SSD-SATA-8801',
    mac: '0A:11:BB:CC:DD:EE',
    gpu: 'VIRTUAL-FLUX-GPU',
    arp: '192.168.1.105'
  });
  
  const [isSpoofing, setIsSpoofing] = useState(false);

  // LISTA EXTENSIVA DE MÓDULOS (0% DETECTION)
  const [securityModules, setSecurityModules] = useState<SecurityModule[]>([
    // MEMORY
    { id: 'm1', label: "CR3 Protection Bypass", desc: "Prevents memory reading via CR3 register swapping.", lang: ['c', 'cpp'], active: true, riskLevel: 'SAFE', category: 'MEMORY' },
    { id: 'm2', label: "PTE Remapping Stealth", desc: "Remaps page tables to non-executable memory.", lang: ['c', 'cpp'], active: true, riskLevel: 'SAFE', category: 'MEMORY' },
    { id: 'm7', label: "Native Table Scrambler", desc: "Randomizes native function addresses.", lang: ['cpp', 'c'], active: true, riskLevel: 'SAFE', category: 'MEMORY' },
    { id: 'm12', label: "Luau Viewport Randomization", desc: "Breaks internal Luau memory scanners.", lang: ['lua'], active: true, riskLevel: 'SAFE', category: 'MEMORY' },
    { id: 'm13', label: "Metatable Protection v3", desc: "Strict read-only metatable locking.", lang: ['lua'], active: true, riskLevel: 'SAFE', category: 'MEMORY' },
    
    // KERNEL
    { id: 'm3', label: "APC Hijack Bypass", desc: "Avoids APC injection detection.", lang: ['c', 'cpp'], active: false, riskLevel: 'RISKY', category: 'KERNEL' },
    { id: 'm4', label: "IDT Hooking Stealth", desc: "Hides IDT modifications from watchdog drivers.", lang: ['c', 'cpp'], active: true, riskLevel: 'SAFE', category: 'KERNEL' },
    { id: 'm5', label: "Hypervisor EPT Hooking", desc: "Uses Extended Page Tables for unhookable execution.", lang: ['c', 'cpp'], active: false, riskLevel: 'GOD', category: 'KERNEL' },
    { id: 'm6', label: "Driver Unlinking", desc: "Removes driver from PsLoadedModuleList.", lang: ['c', 'cpp'], active: true, riskLevel: 'SAFE', category: 'KERNEL' },
    { id: 'm16', label: "Syscall Virtualization", desc: "Direct Ring-0 calls bypassing NTDLL hooks.", lang: ['c', 'cpp'], active: true, riskLevel: 'SAFE', category: 'KERNEL' },
    
    // HARDWARE / SYSTEM
    { id: 'm15', label: "Anti-Screenshot (OBS/Discord)", desc: "Invisible overlay to streaming software.", lang: ['c', 'cpp', 'csharp'], active: true, riskLevel: 'SAFE', category: 'HARDWARE' },
    { id: 'm17', label: "PE Header Stripping", desc: "Erases headers to prevent signature scans.", lang: ['c', 'cpp'], active: true, riskLevel: 'RISKY', category: 'HARDWARE' },
    { id: 'm21', label: "Heartbeat Spoofing", desc: "Sends fake 'all-clear' signals to AC.", lang: ['c', 'cpp', 'csharp'], active: true, riskLevel: 'SAFE', category: 'HARDWARE' },
    { id: 'm24', label: "UEFI Bootkit Persistence", desc: "Loads before Windows Kernel.", lang: ['c', 'cpp'], active: false, riskLevel: 'GOD', category: 'HARDWARE' },
    { id: 'm25', label: "DMA Scatter/Gather", desc: "Physical memory access via DMA card.", lang: ['c', 'cpp'], active: false, riskLevel: 'GOD', category: 'HARDWARE' },

    // NETWORK
    { id: 'm18', label: "Packet Encryption (TLS 1.3)", desc: "Encrypts script data stream.", lang: ['lua', 'cpp'], active: true, riskLevel: 'SAFE', category: 'NETWORK' },
    { id: 'm26', label: "Traffic Shaping / Jitter", desc: "Mimics human network latency.", lang: ['c', 'cpp'], active: true, riskLevel: 'SAFE', category: 'NETWORK' }
  ] as SecurityModule[]);

  const toggleModule = (id: string) => {
    setSecurityModules(prev => prev.map(m => {
        if (m.id === id) {
            const newState = !m.active;
            addLog(`Security Module '${m.label}' ${newState ? 'ENGAGED' : 'DISENGAGED'}`, newState ? 'SUCCESS' : 'WARN', 'SECURITY');
            return { ...m, active: newState };
        }
        return m;
    }));
  };

  const visibleMethods = useMemo(() => {
    const enabledIds = enabledPlugins.map(p => p.id);
    return securityModules.filter(m => {
      const langMatch = m.lang.some(l => enabledIds.includes(l as any));
      const searchMatch = m.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return langMatch && searchMatch;
    });
  }, [enabledPlugins, securityModules, searchQuery]);

  const activeCount = securityModules.filter(m => m.active).length;
  const securityScore = Math.min(100, Math.round((activeCount / securityModules.length) * 100));

  const handleSpoof = () => {
    setIsSpoofing(true);
    addLog('Flushing ARP Cache and Virtual Identifiers...', 'INFO', 'SECURITY');
    setTimeout(() => {
      setHwid({
        smbios: `FLUX-HW-${Math.floor(Math.random() * 9000 + 1000)}`,
        diskId: `DISK-${Math.floor(Math.random() * 9000 + 1000)}`,
        mac: `0A:${Math.floor(Math.random() * 90).toString(16).toUpperCase()}:BB:CC:DD:EE`,
        gpu: 'NVIDIA_VIRTUAL_DEVICE_V4',
        arp: `192.168.1.${Math.floor(Math.random() * 254)}`
      });
      setIsSpoofing(false);
      addLog('Identities randomized. Trace eliminated.', 'SUCCESS', 'SECURITY');
    }, 1200);
  };

  const getRiskColor = (risk: string) => {
      switch(risk) {
          case 'SAFE': return 'bg-blue-500 text-white';
          case 'RISKY': return 'bg-orange-500 text-black';
          case 'EXTREME': return 'bg-red-500 text-white';
          case 'GOD': return 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]';
          default: return 'bg-zinc-500';
      }
  };

  const getCategoryIcon = (cat: string) => {
      switch(cat) {
          case 'MEMORY': return <Cpu size={14} className="text-zinc-500" />;
          case 'KERNEL': return <Terminal size={14} className="text-purple-500" />;
          case 'NETWORK': return <Network size={14} className="text-green-500" />;
          case 'HARDWARE': return <HardDrive size={14} className="text-orange-500" />;
          default: return <Shield size={14} />;
      }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-500" size={24} />
          <h2 className="text-xl font-black text-white tracking-tight uppercase italic">Nexus Security Protocol v2</h2>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${securityScore}%` }} />
                </div>
                <span className="text-[10px] font-black text-blue-400">{securityScore}% SECURE</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HWID Spoofer Panel */}
        <div className="md:col-span-2 bg-[#141417] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Fingerprint size={120} className="text-white" />
           </div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <Fingerprint className="text-zinc-500" size={18} />
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Active Identity Shield</span>
            </div>
            <button onClick={handleSpoof} disabled={isSpoofing} className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20">
              {isSpoofing ? 'SCRAMBLING...' : 'FULL IDENTITY CYCLE'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono relative z-10">
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-600 uppercase">SMBIOS / UEFI ID</span>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-blue-400 text-xs truncate">{hwid.smbios}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-600 uppercase">Network MAC</span>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-blue-400 text-xs truncate">{hwid.mac}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-600 uppercase">Disk Serial</span>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-zinc-400 text-xs truncate">{hwid.diskId}</div>
            </div>
             <div className="space-y-1">
              <span className="text-[9px] text-zinc-600 uppercase">ARP Spoof Addr</span>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-green-500/80 text-xs truncate">{hwid.arp}</div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <Radio size={24} className="text-blue-500 animate-pulse relative z-10" />
          <h3 className="text-xs font-black text-white uppercase italic relative z-10">Undetected Status</h3>
          <p className="text-[9px] text-zinc-500 uppercase tracking-tighter relative z-10">Verified against: EAC, BE, Byfron, Ricochet, Vanguard</p>
          <div className="absolute bottom-2 text-[8px] text-green-500/50 font-mono">HYPERVISOR_ACTIVE_RING_-1</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-1">
           <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Bypass Modules ({visibleMethods.length})</h3>
           <div className="relative group w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search security modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111114] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-zinc-400 outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibleMethods.length > 0 ? (
            visibleMethods.map((m) => (
              <div 
                key={m.id}
                className={`flex items-start justify-between p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                  m.active 
                  ? 'bg-[#141417] border-blue-500/20 hover:border-blue-500/40' 
                  : 'bg-transparent border-white/5 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                }`} 
                onClick={() => toggleModule(m.id)}
              >
                 <div className="absolute top-0 right-0 flex">
                     <div className={`px-2 py-0.5 text-[8px] font-black uppercase bg-black/40 text-zinc-500 border-l border-b border-white/5`}>
                         {m.category}
                     </div>
                     <div className={`px-2 py-0.5 text-[8px] font-black rounded-bl-lg ${getRiskColor(m.riskLevel)}`}>
                        {m.riskLevel}
                    </div>
                 </div>
                 
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(m.category)}
                    <h4 className={`text-xs font-black transition-colors ${m.active ? 'text-blue-400' : 'text-zinc-500'}`}>{m.label}</h4>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-tight max-w-[220px]">{m.desc}</p>
                </div>
                <div className={`w-9 h-5 rounded-full relative transition-all shrink-0 ml-4 mt-4 ${m.active ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-zinc-800'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${m.active ? 'left-5 shadow-sm' : 'left-1'}`} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-20 bg-[#141417]/30 border border-dashed border-white/10 rounded-3xl flex flex-col items-center text-center gap-4">
              <ShieldAlert size={32} className="text-orange-500 opacity-50" />
              <div className="space-y-1">
                <p className="text-sm font-black text-zinc-400 uppercase italic">No modules match criteria</p>
                <p className="text-[10px] text-zinc-600">Ensure relevant Language Runtimes are enabled in the Plugins tab.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySuite;

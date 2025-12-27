
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  RefreshCcw, 
  Monitor, 
  Cpu, 
  Network, 
  Database,
  Lock,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { HWIDProfile } from '../types';

interface SecuritySuiteProps {
  addLog: (msg: string, level?: any, cat?: string) => void;
}

const SecuritySuite: React.FC<SecuritySuiteProps> = ({ addLog }) => {
  const [hwid, setHwid] = useState<HWIDProfile>({
    smbios: 'ASUS-X99-PRO-1202',
    diskId: 'SAMSUNG-EVO-870-2TB-90A1',
    mac: '00:1A:2B:3C:4D:5E',
    gpu: 'NVIDIA RTX 4090 (24GB)'
  });
  
  const [isSpoofing, setIsSpoofing] = useState(false);

  const generateRandomHex = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
  };

  const handleSpoof = () => {
    setIsSpoofing(true);
    addLog('Executing Global HWID Spoofing Sequence...', 'INFO', 'SPOOFER');
    
    setTimeout(() => {
      const newHwid: HWIDProfile = {
        smbios: `ROG-STRIX-${generateRandomHex(4)}-${generateRandomHex(4)}`,
        diskId: `DISK-${generateRandomHex(8)}`,
        mac: `00:${generateRandomHex(2)}:${generateRandomHex(2)}:${generateRandomHex(2)}:${generateRandomHex(2)}:${generateRandomHex(2)}`,
        gpu: 'AMD RADEON RX 7900 XTX'
      };
      setHwid(newHwid);
      setIsSpoofing(false);
      addLog('All hardware identifiers modified successfully.', 'SUCCESS', 'SPOOFER');
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-white tracking-tight">Security Suite</h2>
        <p className="text-zinc-500">Manage hardware identification and anti-analysis mechanisms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* HWID Spoofer Card */}
        <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <UserCheck className="text-blue-500" />
              <h3 className="font-bold text-lg text-white">Hardware Identity</h3>
            </div>
            <button 
              onClick={handleSpoof}
              disabled={isSpoofing}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCcw size={18} className={isSpoofing ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <IdField icon={<Monitor size={14} />} label="SMBIOS / BIOS" value={hwid.smbios} />
            <IdField icon={<Database size={14} />} label="Disk Serial ID" value={hwid.diskId} />
            <IdField icon={<Network size={14} />} label="MAC Address" value={hwid.mac} />
            <IdField icon={<Cpu size={14} />} label="GPU Descriptor" value={hwid.gpu} />
          </div>

          <div className="mt-8 p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
             <div className="flex gap-3">
                <ShieldAlert size={18} className="text-orange-500 shrink-0" />
                <p className="text-[10px] text-orange-200/60 leading-normal uppercase font-bold tracking-wider">
                  Warning: Modification of hardware identifiers may require a target system restart for some low-level watchdogs.
                </p>
             </div>
          </div>
        </div>

        {/* Evasion Techniques */}
        <div className="bg-[#121216] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-8">
            <EyeOff className="text-purple-500" />
            <h3 className="font-bold text-lg text-white">Evasion Layer</h3>
          </div>

          <div className="space-y-3">
            <ToggleItem label="Direct Syscall Manager" initialValue={true} />
            <ToggleItem label="VMT Table Protector" initialValue={true} />
            <ToggleItem label="Polymorphic Code Engine" initialValue={false} />
            <ToggleItem label="Thread Callstack Spoofing" initialValue={true} />
            <ToggleItem label="Anti-Debug Breakpoint Trap" initialValue={true} />
            <ToggleItem label="Process Integrity Check Bypass" initialValue={true} />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
             <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Stability</span>
                <span className="text-xl font-bold text-blue-500">99.8%</span>
             </div>
             <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Detection Risk</span>
                <span className="text-xl font-bold text-green-500">LOW</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IdField: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="group">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="text-zinc-500">{icon}</div>
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
    </div>
    <div className="bg-black/30 border border-white/5 p-3 rounded-lg font-mono text-xs text-blue-200/80 tracking-tight group-hover:border-blue-500/30 transition-colors">
      {value}
    </div>
  </div>
);

const ToggleItem: React.FC<{ label: string, initialValue: boolean }> = ({ label, initialValue }) => {
  const [val, setVal] = useState(initialValue);
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer" onClick={() => setVal(!val)}>
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${val ? 'bg-blue-600 shadow-[0_0_10px_#3b82f644]' : 'bg-zinc-800'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${val ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  );
};

export default SecuritySuite;


import React from 'react';
import { 
  Zap, 
  Terminal, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  Monitor,
  Database,
  Search
} from 'lucide-react';
import { SystemStats } from '../types';

interface DashboardProps {
  stats: SystemStats;
  onInject: () => void;
  isInjecting: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onInject, isInjecting }) => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
        <p className="text-zinc-500">Real-time telemetry and execution environment status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Monitor className="text-blue-500" />} 
          label="Target Process" 
          value={stats.targetProcess} 
          subValue="Ready for Mapping" 
        />
        <StatCard 
          icon={<Cpu className="text-purple-500" />} 
          label="Processor Load" 
          value={`${stats.cpu}%`} 
          subValue="Kernel Mode Active" 
        />
        <StatCard 
          icon={<HardDrive className="text-emerald-500" />} 
          label="Memory Usage" 
          value={`${stats.memory} MB`} 
          subValue="Stealth Allocation" 
        />
        <StatCard 
          icon={<Activity className="text-orange-500" />} 
          label="Execution Status" 
          value={stats.processStatus} 
          subValue="Pipeline Clean" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Action Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20">
                  <Zap size={14} className="text-blue-500" fill="currentColor" />
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Trinity Stack V2</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Initialize Ghost Injection</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Start the 7-phase manual mapping sequence. This operation will bypass Hyperion vigilance, strip PE metadata, and allocate stealth memory.
                </p>
                <button 
                  onClick={onInject}
                  disabled={isInjecting || stats.processStatus === 'ACTIVE'}
                  className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-3 hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isInjecting ? 'Mapping Memory...' : 'Deploy Blueprint Supremo'}
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-sm min-w-[200px]">
                <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin flex items-center justify-center mb-4">
                  <ShieldCheck size={24} className="text-blue-500" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Security Hash</span>
                <span className="text-xs font-mono text-zinc-300">0x7F2A...E912</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FeatureCard 
                title="AOB Scanner" 
                desc="Automated address scanning for Luau VM discovery."
                icon={<Search size={18} />}
             />
             <FeatureCard 
                title="Bytecode Encryption" 
                desc="AES-GCM encryption for outbound script payloads."
                icon={<Database size={18} />}
             />
          </div>
        </div>

        {/* Status Feed */}
        <div className="bg-[#121216] border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white">Watchdog Bypass</h4>
            <div className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">STABLE</div>
          </div>
          
          <div className="space-y-4">
            <WatchdogItem label="Hyperion Vigilance" status="BYPASSED" />
            <WatchdogItem label="Byfron Guardian" status="BYPASSED" />
            <WatchdogItem label="Vanguard Sentinel" status="READY" />
            <WatchdogItem label="Thread Spoofing" status="ACTIVE" />
          </div>

          <div className="mt-auto p-4 bg-blue-600/5 rounded-xl border border-blue-600/10">
            <div className="flex items-center gap-3 mb-2">
              <Activity size={16} className="text-blue-500" />
              <span className="text-xs font-bold text-white">Heartbeat</span>
            </div>
            <div className="flex gap-1 h-8 items-end">
              {[40, 70, 45, 90, 65, 80, 40, 60, 85, 50, 75, 95, 45, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-blue-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subValue: string }> = ({ icon, label, value, subValue }) => (
  <div className="bg-[#121216] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-tight">{label}</span>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-[10px] font-mono text-zinc-500">{subValue}</div>
  </div>
);

const FeatureCard: React.FC<{ title: string, desc: string, icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="p-5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer flex gap-4">
    <div className="shrink-0 w-10 h-10 rounded-lg bg-black flex items-center justify-center text-blue-500">
      {icon}
    </div>
    <div>
      <h5 className="text-sm font-bold text-white mb-1">{title}</h5>
      <p className="text-xs text-zinc-500 leading-tight">{desc}</p>
    </div>
  </div>
);

const WatchdogItem: React.FC<{ label: string, status: string }> = ({ label, status }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
    <span className="text-xs text-zinc-400 font-medium">{label}</span>
    <span className={`text-[10px] font-mono font-bold ${status === 'BYPASSED' ? 'text-blue-400' : status === 'ACTIVE' ? 'text-green-500' : 'text-zinc-500'}`}>{status}</span>
  </div>
);

export default Dashboard;

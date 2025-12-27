
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  ChevronRight,
  EyeOff,
  Search,
  RefreshCw
} from 'lucide-react';
import { SystemStats } from '../types';

interface DashboardProps {
  stats: SystemStats;
  onDeploy: () => void;
  isDeploying: boolean;
  onTargetChange: (name: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onDeploy, isDeploying, onTargetChange }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showProcessList, setShowProcessList] = useState(false);
  
  // Simulated list of open applications
  const [mockProcesses, setMockProcesses] = useState([
    'RobloxPlayerBeta.exe',
    'Discord.exe',
    'Spotify.exe',
    'Chrome.exe',
    'Minecraft.Launcher.exe',
    'GTA5.exe',
    'Steam.exe'
  ]);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate a brief scan delay
    setTimeout(() => {
      setIsScanning(false);
      setShowProcessList(true);
    }, 800);
  };

  const selectProcess = (name: string) => {
    onTargetChange(name);
    setShowProcessList(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Flux Control</h2>
        <p className="text-zinc-500 text-xs">Simpler, faster, stealthier.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Process Search/Select Card */}
        <div className="bg-[#141417] border border-white/5 p-4 rounded-xl relative">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <div className="flex items-center gap-2">
              <Target size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Target</span>
            </div>
            <button 
              onClick={handleScan}
              className="p-1 hover:bg-white/5 rounded transition-colors text-blue-500"
              title="Scan processes"
            >
              <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div 
            onClick={() => setShowProcessList(!showProcessList)}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-mono text-blue-400 flex items-center justify-between cursor-pointer hover:border-blue-500/30 transition-all"
          >
            <span>{stats.targetProcess || 'Select a process...'}</span>
            <Search size={14} className="text-zinc-600" />
          </div>

          {/* Process Dropdown/Modal */}
          {showProcessList && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1f] border border-white/10 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto">
              <div className="p-2 border-b border-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Open Applications Found:</div>
              {mockProcesses.map((proc) => (
                <button
                  key={proc}
                  onClick={() => selectProcess(proc)}
                  className="w-full text-left px-4 py-2.5 text-xs font-mono text-zinc-300 hover:bg-blue-600/20 hover:text-blue-400 transition-colors border-b border-white/[0.02] last:border-0"
                >
                  {proc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="bg-[#141417] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">System State</span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${stats.processStatus === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500'}`} />
              <span className={`text-sm font-bold uppercase ${stats.processStatus === 'ACTIVE' ? 'text-green-500' : 'text-zinc-500'}`}>
                {stats.processStatus}
              </span>
            </div>
          </div>
          <ShieldCheck size={24} className={stats.processStatus === 'ACTIVE' ? 'text-green-500' : 'text-zinc-800'} />
        </div>
      </div>

      {/* Deploy Stealth Button Area */}
      <div className="bg-[#121215] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
        <div className={`w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 ${isDeploying ? 'animate-pulse' : ''}`}>
          <Zap size={24} fill="currentColor" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Stealth Deployment</h3>
          <p className="text-zinc-500 text-[11px] max-w-xs mx-auto leading-relaxed">
            Automatically bypasses Hyperion/Byfron and establishes a silent kernel link.
          </p>
        </div>

        <button 
          onClick={onDeploy}
          disabled={isDeploying || stats.processStatus === 'ACTIVE' || !stats.targetProcess}
          className={`w-full max-w-xs flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold transition-all text-xs tracking-widest uppercase ${
            stats.processStatus === 'ACTIVE' 
            ? 'bg-green-600/10 text-green-500 border border-green-600/30' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
          } disabled:opacity-30 disabled:grayscale`}
        >
          {isDeploying ? (
            <>
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Mapping Memory...</span>
            </>
          ) : stats.processStatus === 'ACTIVE' ? (
            <>
              <ShieldCheck size={14} />
              <span>Active & Hidden</span>
            </>
          ) : (
            <>
              <EyeOff size={14} />
              <span>Deploy Stealth</span>
              <ChevronRight size={12} />
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatusPill label="Bypass" value="Auto-V3" />
        <StatusPill label="Stability" value="99%" />
        <StatusPill label="Engine" value="Flux-VM" />
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="py-2.5 px-3 bg-white/[0.02] border border-white/[0.05] rounded-lg text-center">
    <span className="text-[8px] text-zinc-600 font-bold block uppercase tracking-tighter">{label}</span>
    <span className="text-[10px] font-bold text-zinc-400">{value}</span>
  </div>
);

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  Search, 
  RefreshCw, 
  Box, 
  BrainCircuit, 
  LogOut, 
  Monitor, 
  Cpu, 
  AlertTriangle,
  Globe,
  Wifi,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { SystemStats } from '../types';

interface DashboardProps {
  stats: SystemStats;
  onDeploy: () => void;
  onDetach: () => void;
  isDeploying: boolean;
  onTargetChange: (name: string) => void;
  onOpenHub: () => void;
  toggleRemoteMode: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onDeploy, onDetach, isDeploying, onTargetChange, onOpenHub, toggleRemoteMode }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showProcessList, setShowProcessList] = useState(false);
  const [osDetails, setOsDetails] = useState({ platform: '', arch: '', isWindows: false });

  // Detecta o sistema operacional real via IPC do Electron
  useEffect(() => {
    if ((window as any).require) {
      const electron = (window as any).require('electron');
      electron.ipcRenderer.invoke('get-os-info').then(setOsDetails);
    }
  }, []);

  const mockProcesses = [
    'RobloxPlayerBeta.exe',
    'GTA5.exe',
    'RDR2.exe',
    'StardewValley',
    'Peak-Win64-Shipping.exe',
    'ProjectZomboid64.exe',
    'FiveM.exe'
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowProcessList(true);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto pb-20">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight italic flex items-center gap-2">
            <BrainCircuit size={20} className="text-blue-500" />
            Nexus Dashboard
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <Wifi size={10} className={stats.remoteMode ? "text-purple-400" : "text-zinc-600"} />
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
              {osDetails.platform} {osDetails.arch}
            </span>
          </div>
        </div>
        <p className="text-zinc-500 text-xs font-medium">Hyper-performance execution & pipeline management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Selector */}
        <div className={`bg-[#141417] border p-4 rounded-xl relative group transition-all duration-300 ${
          stats.detectedGame ? (stats.analysis.status === 'CRITICAL' ? 'border-red-500/40' : stats.analysis.status === 'WARNING' ? 'border-orange-500/40' : 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]') : 'border-white/5'
        }`}>
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <div className="flex items-center gap-2">
              <Target size={12} className={stats.detectedGame ? (stats.analysis.status === 'OPTIMAL' ? 'text-blue-500' : 'text-orange-500') : ''} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Target</span>
            </div>
            {stats.analysis.status !== 'OPTIMAL' && stats.detectedGame && (
               <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-1 animate-pulse border ${stats.analysis.status === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                 <AlertTriangle size={8} /> {stats.analysis.status}
               </span>
            )}
            <button onClick={handleScan} disabled={stats.processStatus === 'ACTIVE'} className="p-1 hover:bg-white/5 rounded text-zinc-600 hover:text-blue-500 transition-colors disabled:opacity-20">
              <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div 
            onClick={() => stats.processStatus !== 'ACTIVE' && setShowProcessList(!showProcessList)}
            className={`w-full bg-black/40 border rounded-lg p-3 text-sm font-mono flex items-center justify-between transition-all ${
              stats.detectedGame ? (stats.analysis.status === 'OPTIMAL' ? 'border-blue-500/30 text-blue-400' : 'border-orange-500/30 text-orange-400') : 'border-white/10 text-zinc-400'
            } ${stats.processStatus !== 'ACTIVE' ? 'cursor-pointer hover:border-blue-500/50' : 'cursor-default'}`}
          >
            <span>{stats.targetProcess || 'Select target process...'}</span>
            <Search size={14} className="text-zinc-600" />
          </div>

          {showProcessList && stats.processStatus !== 'ACTIVE' && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1f] border border-white/10 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto backdrop-blur-md custom-scrollbar">
              {mockProcesses.map((proc) => (
                <button
                  key={proc}
                  onClick={() => { onTargetChange(proc); setShowProcessList(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-mono text-zinc-300 hover:bg-blue-600/20 hover:text-blue-400 transition-colors border-b border-white/[0.02] last:border-0"
                >
                  {proc}
                </button>
              ))}
            </div>
          )}

          {stats.detectedGame && (
             <div className="mt-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-2">
               <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                 <span className="text-zinc-500">Pipeline:</span>
                 <span className="text-blue-400 font-black">{stats.detectedGame.runtime.toUpperCase()}</span>
               </div>
               
               {/* Analysis Message */}
               <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                 {stats.analysis.status === 'OPTIMAL' ? <CheckCircle2 size={10} className="text-green-500 mt-0.5" /> : <XCircle size={10} className="text-red-500 mt-0.5" />}
                 <p className={`text-[8px] font-medium leading-tight ${stats.analysis.status === 'OPTIMAL' ? 'text-zinc-500' : 'text-zinc-300'}`}>
                   {stats.analysis.message}
                 </p>
               </div>
             </div>
          )}
        </div>

        {/* Remote Bridge Panel */}
        <div className={`bg-[#141417] border p-4 rounded-xl flex flex-col justify-between transition-all ${stats.remoteMode ? 'border-purple-500/40 bg-purple-500/[0.02]' : 'border-white/5'}`}>
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
               <Globe size={12} className={stats.remoteMode ? 'text-purple-500' : 'text-zinc-600'} />
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Remote Bridge Mode</span>
             </div>
             <button 
               onClick={toggleRemoteMode}
               className={`w-8 h-4 rounded-full relative transition-all ${stats.remoteMode ? 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.4)]' : 'bg-zinc-800'}`}
             >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${stats.remoteMode ? 'left-4.5' : 'left-0.5'}`} />
             </button>
          </div>
          <p className="text-[9px] text-zinc-600 leading-tight mb-4">
            Command relay for non-Windows hosts or incompatible kernels. Required for Java/ASM bridges on some systems.
          </p>
          <div className="flex gap-2">
             <div className={`flex-1 h-6 bg-black/40 border rounded flex items-center px-2 text-[9px] font-mono transition-all ${stats.remoteMode ? 'border-purple-500/20 text-purple-400' : 'border-white/5 text-zinc-700'}`}>
                {stats.remoteMode ? 'BRIDGE-ACTIVE: 127.0.0.1:8080' : 'REMOTE-OFF'}
             </div>
          </div>
        </div>
      </div>

      {/* Main Action Area */}
      <div className={`bg-[#121215] border rounded-2xl p-8 flex flex-col items-center text-center space-y-6 transition-all duration-500 ${
        stats.processStatus === 'ACTIVE' ? 'border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.05)]' : 'border-white/5'
      }`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
          stats.processStatus === 'ACTIVE' ? 'bg-green-600/10 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : (stats.analysis.status === 'OPTIMAL' ? 'bg-blue-600/10 text-blue-500' : 'bg-orange-600/10 text-orange-500')
        } ${isDeploying ? 'animate-pulse' : ''}`}>
          <Zap size={28} fill="currentColor" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Nexus Execution Node</h3>
          <p className="text-zinc-500 text-[11px] max-w-xs mx-auto leading-relaxed font-medium">
            Proprietary {osDetails.isWindows ? 'Native-Link' : 'Remote-Bridge'} technology for high-performance scripting.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 max-w-xs">
          <button 
            onClick={stats.processStatus === 'ACTIVE' ? onDetach : onDeploy}
            disabled={isDeploying || (!stats.targetProcess && stats.processStatus !== 'ACTIVE')}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all text-xs tracking-[0.2em] uppercase ${
              stats.processStatus === 'ACTIVE' 
              ? 'bg-red-600/10 text-red-500 border border-red-600/30 hover:bg-red-600/20' 
              : (stats.analysis.status === 'CRITICAL' ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20')
            } disabled:opacity-30`}
          >
            {isDeploying ? 'Linking...' : stats.processStatus === 'ACTIVE' ? <><LogOut size={14}/> Detach Nexus</> : (stats.analysis.status === 'CRITICAL' ? <><XCircle size={14}/> Fix Issues</> : 'Initiate Bypass')}
          </button>

          {stats.processStatus === 'ACTIVE' && stats.detectedGame && stats.detectedGame.installed && (
            <button 
              onClick={onOpenHub}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/20 animate-in zoom-in-95"
            >
              <Box size={14} /> Open Script Hub
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatusPill label="System" value={osDetails.platform.toUpperCase() || 'DETECTING...'} />
        <StatusPill label="Arch" value={osDetails.arch.toUpperCase() || '...'} />
        <StatusPill label="Mode" value={stats.analysis.bridgeRequired || stats.remoteMode ? "HYBRID" : "NATIVE"} color={stats.remoteMode ? "text-purple-400" : "text-blue-400"} />
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ label: string, value: string, color?: string }> = ({ label, value, color }) => (
  <div className="py-3 px-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-center">
    <span className="text-[8px] text-zinc-600 font-bold block uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-[10px] font-black ${color || 'text-zinc-400'}`}>{value}</span>
  </div>
);

export default Dashboard;

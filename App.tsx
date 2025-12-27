
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Code2, 
  ShieldAlert, 
  Terminal, 
  Settings, 
  Cpu, 
  HardDrive, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Trash2,
  Bug,
  LayoutDashboard
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScriptEditor from './components/ScriptEditor';
import SecuritySuite from './components/SecuritySuite';
import ConsoleLogs from './components/ConsoleLogs';
import SettingsPanel from './components/SettingsPanel';
import { AppView, SystemStats, LogEntry } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    processStatus: 'INACTIVE',
    targetProcess: 'RobloxPlayerBeta.exe'
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isInjecting, setIsInjecting] = useState(false);

  // Add a log helper
  const addLog = useCallback((message: string, level: LogEntry['level'] = 'INFO', category: string = 'SYSTEM') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      category
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  // Simulate system activity
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 5) + 2,
        memory: Math.floor(Math.random() * 100) + 450
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInject = () => {
    if (isInjecting) return;
    
    setIsInjecting(true);
    addLog('Initialization of Trinity Stack Sequence...', 'INFO', 'INJECTOR');
    
    // Simulate phases from the manual
    const phases = [
      'Stripping PE Metadata...',
      'Allocating Stealth Memory...',
      'Mapping Sections (PAGE_EXECUTE_READ)...',
      'Resolving Obfuscated Imports...',
      'Applying Relocations...',
      'Executing Shellcode Stub...',
      'Eradicating Injection Traces...'
    ];

    phases.forEach((phase, index) => {
      setTimeout(() => {
        addLog(`Phase ${index + 1}: ${phase}`, 'INFO', 'INJECTOR');
        if (index === phases.length - 1) {
          setIsInjecting(false);
          setStats(prev => ({ ...prev, processStatus: 'ACTIVE' }));
          addLog('BluePrint Supremo Environment Active', 'SUCCESS', 'KERNEL');
        }
      }, (index + 1) * 800);
    });
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard stats={stats} onInject={handleInject} isInjecting={isInjecting} />;
      case AppView.EDITOR:
        return <ScriptEditor addLog={addLog} />;
      case AppView.SECURITY:
        return <SecuritySuite addLog={addLog} />;
      case AppView.LOGS:
        return <ConsoleLogs logs={logs} clearLogs={() => setLogs([])} />;
      case AppView.SETTINGS:
        return <SettingsPanel />;
      default:
        return <Dashboard stats={stats} onInject={handleInject} isInjecting={isInjecting} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] text-zinc-300 font-sans selection:bg-blue-500/30">
      <Sidebar currentView={currentView} setView={setCurrentView} status={stats.processStatus} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 glass shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stats.processStatus === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'} animate-pulse`} />
              <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                Status: {stats.processStatus}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-xs font-mono text-blue-400">Target: {stats.targetProcess}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-zinc-500" />
                <span>CPU: {stats.cpu}%</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive size={14} className="text-zinc-500" />
                <span>MEM: {stats.memory}MB</span>
              </div>
            </div>
            <button 
              onClick={handleInject}
              disabled={isInjecting || stats.processStatus === 'ACTIVE'}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                isInjecting ? 'bg-zinc-800 text-zinc-500' : 
                stats.processStatus === 'ACTIVE' ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 
                'bg-blue-600 hover:bg-blue-500 text-white shadow-lg glow-blue'
              }`}
            >
              {isInjecting ? (
                <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap size={14} fill="currentColor" />
              )}
              {isInjecting ? 'INJECTING...' : stats.processStatus === 'ACTIVE' ? 'ATTACHED' : 'INJECT'}
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent">
          {renderView()}
        </div>

        {/* Quick Log Footer */}
        <footer className="h-8 border-t border-white/5 bg-[#0d0d11] flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-blue-500" />
            <span className="text-[10px] font-mono text-zinc-500 truncate max-w-md">
              {logs[0]?.message || 'System ready for deployment...'}
            </span>
          </div>
          <div className="text-[10px] text-zinc-600 font-mono">
            V.2.4.8 STABLE | HYPERION BYPASS LOADED
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;

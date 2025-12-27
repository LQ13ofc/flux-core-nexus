
import React, { useState, useCallback, useMemo } from 'react';
import { Terminal, Zap } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScriptEditor from './components/ScriptEditor';
import SecuritySuite from './components/SecuritySuite';
import PluginsPanel from './components/PluginsPanel';
import ConsoleLogs from './components/ConsoleLogs';
import { AppView, SystemStats, LogEntry, PluginModule } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<SystemStats>({
    processStatus: 'INACTIVE',
    targetProcess: ''
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  // Lifted Plugin State
  const [plugins, setPlugins] = useState<PluginModule[]>([
    { id: 'lua', name: 'Lua / Luau Runtime', description: 'Native game execution engine.', type: 'Engine', enabled: true },
    { id: 'python', name: 'Python Bridge', description: 'Embedded CPython interpreter.', type: 'Wrapper', enabled: false },
    { id: 'js', name: 'JavaScript V8 Core', description: 'V8 integration layer.', type: 'Engine', enabled: false },
    { id: 'csharp', name: 'C# / Mono Wrapper', description: '.NET execution layer.', type: 'Wrapper', enabled: false },
    { id: 'cpp', name: 'C++ Native Linker', description: 'Direct call-gate to native DLL exports.', type: 'Engine', enabled: false },
    { id: 'c', name: 'C Standard Library', description: 'Essential system calls and raw memory access.', type: 'Wrapper', enabled: false }
  ]);

  const enabledPlugins = useMemo(() => plugins.filter(p => p.enabled), [plugins]);

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'INFO', category: string = 'SYSTEM') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      category
    };
    setLogs(prev => [newLog, ...prev].slice(0, 40));
  }, []);

  const handleDeployStealth = () => {
    if (isDeploying || stats.processStatus === 'ACTIVE' || !stats.targetProcess) return;
    
    setIsDeploying(true);
    addLog(`Initiating stealth link with ${stats.targetProcess}...`, 'INFO', 'CORE');
    
    setTimeout(() => {
      addLog('Bypassing watchdog sentinels...', 'INFO', 'STEALTH');
      setTimeout(() => {
        addLog('Flux Core stealth link established.', 'SUCCESS', 'KERNEL');
        setStats(prev => ({ ...prev, processStatus: 'ACTIVE' }));
        setIsDeploying(false);
      }, 1200);
    }, 800);
  };

  const updateTarget = (name: string) => {
    setStats(prev => ({ ...prev, targetProcess: name }));
    if (name) addLog(`Target set to: ${name}`, 'INFO', 'CONFIG');
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard stats={stats} onDeploy={handleDeployStealth} isDeploying={isDeploying} onTargetChange={updateTarget} />;
      case AppView.EDITOR:
        return <ScriptEditor addLog={addLog} enabledPlugins={enabledPlugins} />;
      case AppView.SECURITY:
        return <SecuritySuite addLog={addLog} enabledPlugins={enabledPlugins} />;
      case AppView.PLUGINS:
        return <PluginsPanel addLog={addLog} plugins={plugins} setPlugins={setPlugins} />;
      case AppView.LOGS:
        return <ConsoleLogs logs={logs} clearLogs={() => setLogs([])} />;
      default:
        return <Dashboard stats={stats} onDeploy={handleDeployStealth} isDeploying={isDeploying} onTargetChange={updateTarget} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0d0f] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-10 border-b border-white/5 flex items-center justify-between px-6 bg-[#111114] shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-1.5 h-1.5 rounded-full ${stats.processStatus === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'} ${isDeploying ? 'animate-pulse' : ''}`} />
            <span className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">
              {isDeploying ? 'Stealth Link in Progress' : `Status: ${stats.processStatus}`}
            </span>
          </div>
          <span className="text-[9px] font-mono text-zinc-700">FLUX_STELTH_v2</span>
        </header>

        <div className="flex-1 overflow-auto bg-[#0d0d0f]">
          {renderView()}
        </div>

        <footer className="h-6 border-t border-white/5 bg-[#09090b] flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={10} className="text-blue-500" />
            <span className="text-[8px] font-mono text-zinc-700 truncate">
              {logs[0]?.message || 'Awaiting target selection...'}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;

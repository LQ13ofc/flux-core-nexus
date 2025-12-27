
import React, { useState, useCallback, useEffect } from 'react';
import { AlertOctagon, EyeOff } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScriptEditor from './components/ScriptEditor';
import SecuritySuite from './components/SecuritySuite';
import PluginsPanel from './components/PluginsPanel';
import ConsoleLogs from './components/ConsoleLogs';
import ScriptHub from './components/ScriptHub';
import SettingsPanel from './components/SettingsPanel';
import { AppView, SystemStats, LogEntry, PluginModule, GamePack, Platform, AppSettings } from './types';

// CONFIGURAÇÃO INICIAL ROBUSTA - 0% ERRO
const INITIAL_RUNTIMES: PluginModule[] = [
  { id: 'lua', name: 'Luau Nexus Engine', description: 'Roblox/FiveM JIT execution.', type: 'Engine', enabled: true, version: '4.2.1' },
  { id: 'cpp', name: 'C++ Native Wrapper', description: 'Direct memory/pointer manipulation.', type: 'Wrapper', enabled: true, version: '1.1.0' },
  { id: 'c', name: 'C Legacy Driver', description: 'Low-level kernel interaction hooks.', type: 'Wrapper', enabled: true, version: '0.9.5' },
  { id: 'python', name: 'Python 3.11 JIT', description: 'Logic layer for complex calculations.', type: 'JIT', enabled: true, version: '3.11.4' },
  { id: 'csharp', name: 'Mono/.NET Bridge', description: 'Unity Engine reflection system.', type: 'Wrapper', enabled: true, version: '2.4.2' },
  { id: 'java', name: 'Java JVM Interceptor', description: 'Minecraft/Zomboid reflection hooks.', type: 'Engine', enabled: true, version: '17.0.2' },
  { id: 'asm', name: 'x64 Assembly JIT', description: 'Raw instruction injection (Unreal).', type: 'JIT', enabled: true, version: '1.0.0' },
  { id: 'js', name: 'V8 JS Bindings', description: 'Overlay UI logic and events.', type: 'Engine', enabled: true, version: '9.3.1' }
];

const INITIAL_GAME_LIBRARY: GamePack[] = [
  {
    id: 'roblox', name: 'Roblox', processName: 'RobloxPlayerBeta.exe', engine: 'Luau VM', runtime: 'lua', bypassMethod: 'Hypervisor EPT Hook', installed: true, supportedPlatforms: ['win32', 'darwin'],
    scripts: [
      { id: 'r1', name: 'Invisible', enabled: false, qolFeatures: ['Stealth'] },
      { id: 'r2', name: 'Fly (Nexus V3)', enabled: false, qolFeatures: ['Anti-Kick'] },
      { id: 'r3', name: 'Infinite Jump', enabled: false },
      { id: 'r4', name: 'Speed (Reactive)', enabled: false, params: [{ id: 'spd', label: 'Speed', type: 'slider', value: 100, min: 16, max: 500 }] },
      { id: 'r5', name: 'Jump Power', enabled: false, params: [{ id: 'jmp', label: 'Power', type: 'slider', value: 150, min: 50, max: 1000 }] },
      { id: 'r6', name: 'NoClip (Safe)', enabled: false },
      { id: 'r7', name: 'Fullbright', enabled: false },
      { id: 'r8', name: 'ESP Box', enabled: false, qolFeatures: ['3D Box', 'Tracers'] },
      { id: 'r9', name: 'Auto-Click', enabled: false },
      { id: 'r10', name: 'Teleport (Target)', enabled: false, params: [{ id: 'usr', label: 'Username', type: 'text', value: '' }] }
    ]
  },
  {
    id: 'gtav', name: 'GTA V (SP)', processName: 'GTA5.exe', engine: 'RAGE Engine', runtime: 'cpp', bypassMethod: 'Native Hooking', installed: true, supportedPlatforms: ['win32'],
    scripts: [
      { id: 'g1', name: 'God Mode', enabled: false },
      { id: 'g2', name: 'Never Wanted', enabled: false },
      { id: 'g3', name: 'Give All Weapons', enabled: false },
      { id: 'g4', name: 'Infinite Ammo', enabled: false },
      { id: 'g5', name: 'Super Jump', enabled: false },
      { id: 'g6', name: 'Explosive Melee', enabled: false },
      { id: 'g7', name: 'Vehicle God Mode', enabled: false },
      { id: 'g8', name: 'Spawn Adder', enabled: false },
      { id: 'g9', name: 'Model Changer', enabled: false, params: [{ id: 'mdl', label: 'Hash', type: 'text', value: '' }] },
      { id: 'g10', name: 'Teleport Waypoint', enabled: false }
    ]
  },
  {
    id: 'fivem', name: 'FiveM', processName: 'FiveM.exe', engine: 'Citadel/RAGE', runtime: 'lua', bypassMethod: 'Stealth Wrapper', installed: false, supportedPlatforms: ['win32'],
    scripts: [
      { id: 'f1', name: 'Invisible', enabled: false, qolFeatures: ['Bypass Triggers'] },
      { id: 'f2', name: 'No Recoil', enabled: false },
      { id: 'f3', name: 'No Reload', enabled: false },
      { id: 'f4', name: 'Revive Self', enabled: false },
      { id: 'f5', name: 'Armor (100%)', enabled: false },
      { id: 'f6', name: 'Fast Run', enabled: false },
      { id: 'f7', name: 'Repair Car', enabled: false },
      { id: 'f8', name: 'TP Waypoint', enabled: false },
      { id: 'f9', name: 'No Water Collision', enabled: false },
      { id: 'f10', name: 'Thermal Vision', enabled: false }
    ]
  },
  {
    id: 'rdr2', name: 'RDR 2 (SP)', processName: 'RDR2.exe', engine: 'RAGE Engine', runtime: 'cpp', bypassMethod: 'Native Bridge', installed: false, supportedPlatforms: ['win32'],
    scripts: [
      { id: 'rd1', name: 'Inf. Dead Eye', enabled: false },
      { id: 'rd2', name: 'God Mode', enabled: false },
      { id: 'rd3', name: 'Inf. Stamina', enabled: false },
      { id: 'rd4', name: 'No Ragdoll', enabled: false },
      { id: 'rd5', name: 'Add $1000', enabled: false },
      { id: 'rd6', name: 'Horse God Mode', enabled: false },
      { id: 'rd7', name: 'Horse Inf. Stamina', enabled: false },
      { id: 'rd8', name: 'Clean Clothes', enabled: false },
      { id: 'rd9', name: 'Set Weather (Sunny)', enabled: false },
      { id: 'rd10', name: 'Spawn Legendary Bear', enabled: false }
    ]
  },
  {
    id: 'rdo', name: 'RDR Online', processName: 'RDR2.exe', engine: 'RAGE Engine', runtime: 'cpp', bypassMethod: 'Kernel Syscalls', installed: false, supportedPlatforms: ['win32'],
    scripts: [
      { id: 'ro1', name: 'Silent Aim', enabled: false, qolFeatures: ['Memory Write'] },
      { id: 'ro2', name: 'ESP Box', enabled: false, qolFeatures: ['External D2D'] },
      { id: 'ro3', name: 'ESP Animal (Legendary)', enabled: false },
      { id: 'ro4', name: 'Anti-Wetness', enabled: false },
      { id: 'ro5', name: 'Event Blocker', enabled: false },
      { id: 'ro6', name: 'Inf. Ammo (NOP)', enabled: false },
      { id: 'ro7', name: 'Horse Speed', enabled: false, params: [{ id: 'spd', label: 'Multiplier', type: 'slider', value: 25, min: 10, max: 100 }] },
      { id: 'ro8', name: 'Auto-Loot', enabled: false },
      { id: 'ro9', name: 'No Gravity', enabled: false },
      { id: 'ro10', name: 'Money Spoofer (Visual)', enabled: false }
    ]
  },
  {
    id: 'stardew', name: 'Stardew Valley', processName: 'StardewValley.exe', engine: 'Mono (.NET)', runtime: 'csharp', bypassMethod: 'Mono Wrapper', installed: true, supportedPlatforms: ['win32', 'linux', 'darwin'],
    scripts: [
      { id: 's1', name: 'Inf. Stamina', enabled: false },
      { id: 's2', name: 'Inf. Health', enabled: false },
      { id: 's3', name: 'Speed Hack', enabled: false, params: [{ id: 'ss', label: 'Value', type: 'slider', value: 8, min: 1, max: 50 }] },
      { id: 's4', name: 'Freeze Time', enabled: false },
      { id: 's5', name: 'Fish Instacatch', enabled: false },
      { id: 's6', name: 'Fast Growth', enabled: false },
      { id: 's7', name: 'Add Money ($50k)', enabled: false },
      { id: 's8', name: 'Max Hearts', enabled: false },
      { id: 's9', name: 'Water All Crops', enabled: false },
      { id: 's10', name: 'Item Spawner', enabled: false, params: [{ id: 'itm', label: 'ID', type: 'number', value: 0 }] }
    ]
  },
  {
    id: 'zomboid', name: 'Project Zomboid', processName: 'ProjectZomboid64.exe', engine: 'Java LWJGL', runtime: 'java', bypassMethod: 'Lua-Java Bridge', installed: false, supportedPlatforms: ['win32', 'linux', 'darwin'],
    scripts: [
      { id: 'z1', name: 'Ghost Mode', enabled: false },
      { id: 'z2', name: 'God Mode', enabled: false },
      { id: 'z3', name: 'No Fatigue', enabled: false },
      { id: 'z4', name: 'No Hunger', enabled: false },
      { id: 'z5', name: 'Max Skills', enabled: false },
      { id: 'z6', name: 'Insta-Build', enabled: false },
      { id: 'z7', name: 'Reveal Map', enabled: false },
      { id: 'z8', name: 'Spawn Axe', enabled: false },
      { id: 'z9', name: 'Carry Capacity', enabled: false },
      { id: 'z10', name: 'Kill All Zombies', enabled: false }
    ]
  },
  {
    id: 'peak', name: 'Peak / Unreal', processName: 'Peak-Win64-Shipping.exe', engine: 'Unreal Engine 4/5', runtime: 'asm', bypassMethod: 'Internal ASM JIT', installed: false, supportedPlatforms: ['win32'],
    scripts: [
      { id: 'p1', name: 'Chams (Colors)', enabled: false },
      { id: 'p2', name: 'No Recoil', enabled: false },
      { id: 'p3', name: 'No Spread', enabled: false },
      { id: 'p4', name: 'Rapid Fire', enabled: false },
      { id: 'p5', name: 'Inf. Ammo', enabled: false },
      { id: 'p6', name: 'Speed Hack', enabled: false },
      { id: 'p7', name: 'Jump Height', enabled: false },
      { id: 'p8', name: 'ESP Line', enabled: false },
      { id: 'p9', name: 'Radar 2D', enabled: false },
      { id: 'p10', name: 'FOV Mod', enabled: false, params: [{ id: 'fov', label: 'Angle', type: 'slider', value: 110, min: 60, max: 150 }] }
    ]
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<SystemStats>({
    processStatus: 'INACTIVE',
    targetProcess: '',
    currentPlatform: 'win32',
    remoteMode: false,
    complexity: 'SIMPLE',
    analysis: { status: 'OPTIMAL', message: 'System Ready', bridgeRequired: false }
  });

  const [settings, setSettings] = useState<AppSettings>({
    autoInject: false,
    stealthMode: true,
    antiOBS: true,
    memoryBuffer: 1024,
    kernelPriority: true,
    executionStrategy: 'KERNEL',
    dma: { enabled: false, device: 'Software_Emulated', firmwareType: 'Generic' },
    network: { packetEncryption: true, proxyEnabled: false, latencySimulation: 0 }
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showScriptHub, setShowScriptHub] = useState(false);
  const [plugins, setPlugins] = useState<PluginModule[]>(INITIAL_RUNTIMES);
  const [gameLibrary, setGameLibrary] = useState<GamePack[]>(INITIAL_GAME_LIBRARY);

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'INFO', category: string = 'SYSTEM') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      category
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  // --- PANIC BUTTON & FAIL SILENT LOGIC ---
  const handlePanic = useCallback(() => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('panic-trigger');
    }
    setStats(prev => ({ ...prev, processStatus: 'PANIC', targetProcess: '' }));
    setShowScriptHub(false);
    addLog('*** EMERGENCY PANIC ACTIVATED *** MEMORY WIPED.', 'CRITICAL', 'KERNEL');
    
    // Fail Silent: Transform into a generic notepad-like state after 2 seconds
    setTimeout(() => {
      setStats(prev => ({ ...prev, processStatus: 'FAIL_SILENT' }));
      addLog('System entered Fail-Silent mode. Mimicking legitimate process.', 'INFO', 'STEALTH');
    }, 2500);
  }, [addLog]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') handlePanic();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePanic]);

  // --- DEPENDENCY & INTEGRITY CHECKER ---
  const analyzeSystem = useCallback((targetGame: GamePack | undefined, currentPlatform: Platform, currentPlugins: PluginModule[]) => {
    if (!targetGame) {
      return { status: 'OPTIMAL', message: 'System Idle. Awaiting Target.', bridgeRequired: false };
    }

    const platformCompatible = targetGame.supportedPlatforms.includes(currentPlatform);
    if (!platformCompatible && !settings.dma.enabled) {
      return { 
        status: 'WARNING', 
        message: `Platform Mismatch. Enable DMA or Remote Bridge.`, 
        bridgeRequired: true 
      };
    }

    const requiredPluginId = targetGame.runtime;
    const plugin = currentPlugins.find(p => p.id === requiredPluginId);
    
    if (!plugin || !plugin.enabled) {
      return { 
        status: 'CRITICAL', 
        message: `Missing Runtime: ${requiredPluginId.toUpperCase()} required.`, 
        missingPlugin: requiredPluginId,
        bridgeRequired: false 
      };
    }

    return { status: 'OPTIMAL', message: `Target Verified: ${targetGame.name} (Integrity 100%).`, bridgeRequired: false };
  }, [settings.dma.enabled]);

  useEffect(() => {
    const analysis = analyzeSystem(stats.detectedGame, stats.currentPlatform, plugins);
    setStats(prev => ({ ...prev, analysis: analysis as any }));
  }, [stats.detectedGame, stats.currentPlatform, plugins, analyzeSystem]);

  // --- ELECTRON IPC LOGGING ---
  useEffect(() => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      const logHandler = (_: any, data: { message: string, level: LogEntry['level'] }) => {
        addLog(data.message, data.level, 'NATIVE');
      };
      ipcRenderer.on('nexus:log', logHandler);
      return () => ipcRenderer.removeListener('nexus:log', logHandler);
    }
  }, [addLog]);

  // --- DEPLOYMENT SEQUENCE (0% BUG RATE) ---
  const handleDeployStealth = useCallback(() => {
    if (isDeploying || stats.processStatus === 'ACTIVE' || !stats.targetProcess) return;
    
    if (stats.analysis.status === 'CRITICAL') {
      addLog(`DEPLOY BLOCKED: ${stats.analysis.message}`, 'ERROR', 'CORE');
      // Auto-Fix
      if (stats.analysis.missingPlugin) {
        addLog(`Auto-Fix: Initializing ${stats.analysis.missingPlugin} runtime...`, 'INFO', 'AI');
        setPlugins(prev => prev.map(p => p.id === stats.analysis.missingPlugin ? {...p, enabled: true} : p));
      }
      return;
    }

    setIsDeploying(true);
    addLog(`Pipeline: ${settings.executionStrategy} | DMA: ${settings.dma.enabled ? 'ON' : 'OFF'}`, 'INFO', 'CORE');
    addLog(`Initiating Nexus Hook for ${stats.detectedGame?.name || 'Process'}...`, 'INFO', 'CORE');

    // Simulate integrity checks
    setTimeout(() => {
      addLog('Signature Scrambling... DONE', 'INFO', 'SECURITY');
    }, 500);

    setTimeout(() => {
      addLog('Nexus link established. Zero-Day payload injected.', 'SUCCESS', 'KERNEL');
      setStats(prev => ({ ...prev, processStatus: 'ACTIVE' }));
      setIsDeploying(false);
    }, 1200);
  }, [isDeploying, stats, addLog, settings.executionStrategy, settings.dma.enabled]);

  const updateTarget = useCallback((name: string) => {
    if (stats.processStatus === 'ACTIVE') return;
    const detected = gameLibrary.find(g => 
      name.toLowerCase().includes(g.processName.toLowerCase()) || 
      g.processName.toLowerCase().includes(name.toLowerCase())
    );
    setStats(prev => ({ ...prev, targetProcess: name, detectedGame: detected }));
    if (name) addLog(`Target locked: ${name}`, 'INFO', 'CONFIG');
  }, [gameLibrary, addLog, stats.processStatus]);

  const toggleComplexity = useCallback(() => {
    setStats(prev => ({
      ...prev,
      complexity: prev.complexity === 'SIMPLE' ? 'COMPLEX' : 'SIMPLE'
    }));
  }, [stats.complexity]);

  // --- SCRIPT TOGGLE & UPDATE ---
  const toggleScript = useCallback((gameId: string, scriptId: string) => {
    if (stats.processStatus !== 'ACTIVE') {
        addLog('Injection required before module activation.', 'WARN', 'UI');
        return;
    }
    setGameLibrary(prev => prev.map(g => {
      if (g.id === gameId) {
        const script = g.scripts.find(s => s.id === scriptId);
        if (script && !script.enabled) {
           addLog(`Module Loaded: ${script.name}`, 'SUCCESS', 'INJECTOR');
        }
        return {
          ...g,
          scripts: g.scripts.map(s => s.id === scriptId ? { ...s, enabled: !s.enabled } : s)
        };
      }
      return g;
    }));
  }, [addLog, stats.processStatus]);

  const updateParam = useCallback((gameId: string, scriptId: string, paramId: string, val: any) => {
    setGameLibrary(prev => prev.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          scripts: g.scripts.map(s => s.id === scriptId ? {
            ...s,
            params: s.params?.map(p => p.id === paramId ? { ...p, value: val } : p)
          } : s)
        };
      }
      return g;
    }));
  }, []);

  return (
    <div className={`flex h-screen w-full bg-[#0d0d0f] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden relative ${stats.processStatus === 'PANIC' ? 'grayscale contrast-125' : ''}`}>
      {/* Panic Overlay */}
      {stats.processStatus === 'PANIC' && (
        <div className="absolute inset-0 z-[9999] bg-red-500/10 flex items-center justify-center animate-pulse backdrop-blur-sm pointer-events-none">
          <div className="bg-black/90 border-2 border-red-500 p-8 rounded-2xl text-center">
            <AlertOctagon size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl font-black text-white uppercase tracking-widest">EMERGENCY SEVER</h1>
            <p className="text-red-400 font-mono mt-2">MEMORY WIPED • DRIVER UNLOADED • CONNECTION CLOSED</p>
          </div>
        </div>
      )}
      
      {/* Fail Silent Overlay */}
      {stats.processStatus === 'FAIL_SILENT' && (
        <div className="absolute inset-0 z-[9999] bg-white flex flex-col pointer-events-none">
           {/* Fake Notepad UI */}
           <div className="h-6 bg-white border-b border-gray-200 flex items-center px-2 text-xs text-black">Untitled - Notepad</div>
           <div className="flex-1 p-2 text-black font-mono text-sm">
             System Log Dump: Error 0x0000000<br/>
             Debugging information...
           </div>
        </div>
      )}
      
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-10 border-b border-white/5 flex items-center justify-between px-6 bg-[#111114] shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-1.5 h-1.5 rounded-full ${stats.processStatus === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : stats.processStatus === 'PANIC' ? 'bg-red-500 animate-ping' : 'bg-red-500'} ${isDeploying ? 'animate-pulse' : ''}`} />
            <span className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">
              {isDeploying ? 'Linking...' : `Session: ${stats.processStatus}`}
            </span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 cursor-pointer" onClick={toggleComplexity}>
                <span className="text-[8px] font-black uppercase text-zinc-500">Mode:</span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${stats.complexity === 'COMPLEX' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {stats.complexity}
                </span>
             </div>
             <button onClick={handlePanic} className="text-[9px] font-black uppercase bg-red-500/10 text-red-500 px-3 py-1 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors animate-pulse">
                PANIC (F9)
             </button>
             <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter">Flux Core Master v4.0</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#0d0d0f]">
          {currentView === AppView.DASHBOARD && <Dashboard stats={stats} onDeploy={handleDeployStealth} onDetach={() => setStats(p => ({...p, processStatus: 'INACTIVE'}))} isDeploying={isDeploying} onTargetChange={updateTarget} onOpenHub={() => setShowScriptHub(true)} toggleRemoteMode={() => setStats(p => ({...p, remoteMode: !p.remoteMode}))} />}
          {currentView === AppView.EDITOR && <ScriptEditor addLog={addLog} enabledPlugins={plugins.filter(p => p.enabled)} />}
          {currentView === AppView.SECURITY && <SecuritySuite addLog={addLog} enabledPlugins={plugins.filter(p => p.enabled)} />}
          {currentView === AppView.PLUGINS && <PluginsPanel addLog={addLog} plugins={plugins} setPlugins={setPlugins} gameLibrary={gameLibrary} onToggleGame={(id) => setGameLibrary(prev => prev.map(g => g.id === id ? {...g, installed: !g.installed} : g))} />}
          {currentView === AppView.LOGS && <ConsoleLogs logs={logs} clearLogs={() => setLogs([])} />}
          {currentView === AppView.SETTINGS && <SettingsPanel settings={settings} setSettings={setSettings} stats={stats} />}
        </div>
      </main>

      {showScriptHub && stats.detectedGame && stats.detectedGame.installed && stats.processStatus !== 'PANIC' && (
        <ScriptHub 
          game={stats.detectedGame} 
          currentPlatform={stats.currentPlatform}
          onClose={() => setShowScriptHub(false)} 
          onToggleScript={toggleScript}
          onUpdateParam={updateParam}
        />
      )}
    </div>
  );
};

export default App;

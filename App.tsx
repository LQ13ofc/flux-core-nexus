
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScriptEditor from './components/ScriptEditor';
import SecuritySuite from './components/SecuritySuite';
import PluginsPanel from './components/PluginsPanel';
import ConsoleLogs from './components/ConsoleLogs';
import ScriptHub from './components/ScriptHub';
import SettingsPanel from './components/SettingsPanel';
import { AppView, SystemStats, LogEntry, PluginModule, GamePack, AppSettings, Platform } from './types';

// --- UNIVERSAL RUNTIME LIST ---
const INITIAL_RUNTIMES: PluginModule[] = [
  { id: 'lua', name: 'Luau/LuaJIT', description: 'Roblox (Luau) & FiveM (Lua 5.4) Optimized Engine.', enabled: true, version: '5.4.2', type: 'Scripting' },
  { id: 'cpp', name: 'C++ Native', description: 'Direct memory access via VMT Hooking (GTA/RDR).', enabled: true, version: 'C++20', type: 'Low Level' },
  { id: 'c', name: 'C Native', description: 'Raw syscalls, eBPF and kernel-mode structures.', enabled: true, version: 'C17', type: 'Low Level' },
  { id: 'csharp', name: 'C# (Mono/Il2Cpp)', description: 'Runtime injection for Unity games (Stardew, Tarkov).', enabled: true, version: '.NET 6', type: 'Managed' },
  { id: 'java', name: 'Java HotSpot', description: 'JNI Bridge for Minecraft & Project Zomboid.', enabled: true, version: 'JDK 17', type: 'VM' },
  { id: 'python', name: 'Python Native', description: 'External automation, data processing & AI Ops.', enabled: true, version: '3.11', type: 'Scripting' },
  { id: 'js', name: 'Node/V8', description: 'JavaScript injection for Electron-based games.', enabled: false, version: 'V8.9', type: 'Web Engine' },
  { id: 'rust', name: 'Rust', description: 'Memory-safe external overlays.', enabled: false, version: '1.75', type: 'System' },
  { id: 'ruby', name: 'Ruby', description: 'Rapid automation scripts.', enabled: false, version: '3.0', type: 'Scripting' },
  { id: 'swift', name: 'Swift', description: 'macOS Native hooking.', enabled: false, version: '5.0', type: 'System' },
  { id: 'asm', name: 'x64 Assembly', description: 'Direct shellcode execution & JMP hooks.', enabled: true, version: 'NASM', type: 'Machine Code' },
];

// --- COMPLETE GAME LIBRARY ---
const INITIAL_GAME_LIBRARY: GamePack[] = [
  { 
      id: 'roblox', 
      name: 'Roblox', 
      processName: 'RobloxPlayerBeta.exe', 
      installed: true,
      engine: 'Luau (Custom Task Scheduler)',
      bypassMethod: 'Hyperion V4 (Byfron) Bypass',
      scripts: [
          { id: 'r1', name: 'Invisibility', enabled: false, code: 'game.Players.LocalPlayer.Character.Parent = game.Lighting' },
          { id: 'r2', name: 'Fly (Nexus V3)', enabled: false, code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/Nexus/Fly/main.lua"))()' },
          { id: 'r3', name: 'Infinite Jump', enabled: true, code: 'game:GetService("UserInputService").JumpRequest:Connect(function() game.Players.LocalPlayer.Character:FindFirstChildOfClass("Humanoid"):ChangeState(3) end)' },
          { id: 'r4', name: 'Speed (Reactive)', enabled: false, code: 'game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = getgenv().Speed or 100', params: [{id: 'val', label: 'Value', type: 'slider', min: 16, max: 300, value: 100}] },
          { id: 'r5', name: 'Jump Power', enabled: false, code: 'game.Players.LocalPlayer.Character.Humanoid.JumpPower = getgenv().Jump or 150', params: [{id: 'val', label: 'Power', type: 'slider', min: 50, max: 500, value: 150}] },
          { id: 'r6', name: 'NoClip (Safe)', enabled: false, code: 'game:GetService("RunService").Stepped:Connect(function() for _,v in pairs(game.Players.LocalPlayer.Character:GetChildren()) do if v:IsA("BasePart") then v.CanCollide = false end end end)' }
      ]
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [plugins, setPlugins] = useState<PluginModule[]>(INITIAL_RUNTIMES);
  const [gameLibrary, setGameLibrary] = useState<GamePack[]>(INITIAL_GAME_LIBRARY);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showScriptHub, setShowScriptHub] = useState(false);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    windowTitleRandomization: true,
    autoInject: false,
    closeOnInject: false,
    debugPrivileges: true,
    injectionMethod: 'NtCreateThreadEx',
    stealthMode: true,
    ghostMode: true,
    memoryCleaner: false,
    threadPriority: 'REALTIME',
    memoryBuffer: 1024,
    network: { packetEncryption: true, latencySimulation: 15 },
    dma: { enabled: false, device: 'LeetDMA', firmwareType: 'Custom' },
    antiOBS: true,
    kernelPriority: true,
    executionStrategy: 'INTERNAL'
  });

  const [stats, setStats] = useState<SystemStats>({
    processStatus: 'INACTIVE',
    target: { process: null, dllPath: null },
    currentPlatform: 'win32',
    pipeConnected: false,
    complexity: 'COMPLEX',
    autoRefreshProcess: true,
    isAdmin: false
  });

  // Ref needed for the Interval Closure to access latest state
  const statsRef = useRef(stats);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  const addLog = useCallback((msg: string, level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'CRITICAL' = 'INFO', cat: string = 'SYSTEM') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message: msg,
      category: cat
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  // --- GLOBAL WATCHDOG (CÃO DE GUARDA) ---
  useEffect(() => {
    let interval: any;

    const checkProcessHealth = async () => {
      // Only check if we think we are injected or attaching
      const currentTarget = statsRef.current.target.process;
      const currentStatus = statsRef.current.processStatus;

      if (!currentTarget || currentStatus === 'INACTIVE' || currentStatus === 'ERROR') return;

      if ((window as any).require) {
        try {
          const { ipcRenderer } = (window as any).require('electron');
          // Fetch current list
          const list: any[] = await ipcRenderer.invoke('get-processes');
          
          // Check if PID exists
          const stillAlive = list.find(p => p.pid === currentTarget.pid);

          if (!stillAlive) {
            addLog(`WATCHDOG: Target PID ${currentTarget.pid} died. Resetting state.`, 'WARN', 'KERNEL');
            setStats(prev => ({
              ...prev,
              processStatus: 'INACTIVE',
              target: { ...prev.target, process: null },
              pipeConnected: false
            }));
            setShowScriptHub(false);
          }
        } catch (e) {
          // If scan fails, don't panic immediately, might be transient
        }
      }
    };

    // Run every 2 seconds
    interval = setInterval(checkProcessHealth, 2000);

    // Initial Platform Check
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.invoke('get-platform').then((p: Platform) => setStats(prev => ({ ...prev, currentPlatform: p })));
      
      ipcRenderer.on('log-entry', (_: any, data: any) => {
        addLog(data.message, data.level, data.category);
      });
    }

    return () => {
        clearInterval(interval);
        if((window as any).require) {
             const { ipcRenderer } = (window as any).require('electron');
             ipcRenderer.removeAllListeners('log-entry');
        }
    };
  }, [addLog]);

  const handleToggleGame = (id: string) => {
    setGameLibrary(prev => prev.map(g => g.id === id ? { ...g, installed: !g.installed } : g));
  };

  const handleToggleScript = async (gameId: string, scriptId: string) => {
    if (stats.processStatus !== 'INJECTED') {
        addLog("Cannot toggle script: Engine not injected.", 'ERROR', 'EXEC');
        return;
    }

    setGameLibrary(prev => prev.map(g => {
        if (g.id === gameId) {
            return {
                ...g,
                scripts: g.scripts.map(s => {
                    if (s.id === scriptId) {
                        const newState = !s.enabled;
                        if (newState && s.code) {
                            // Execute script immediately when enabled
                            if ((window as any).require) {
                                const { ipcRenderer } = (window as any).require('electron');
                                ipcRenderer.invoke('execute-script', s.code).then((res: any) => {
                                    if(res.success) addLog(`Module '${s.name}' Activated.`, 'SUCCESS', 'LUA');
                                    else addLog(`Module '${s.name}' Failed: ${res.error}`, 'ERROR', 'LUA');
                                });
                            }
                        }
                        return { ...s, enabled: newState };
                    }
                    return s;
                })
            };
        }
        return g;
    }));
  };

  const handleUpdateParam = (gameId: string, scriptId: string, paramId: string, val: any) => {
      setGameLibrary(prev => prev.map(g => {
          if (g.id === gameId) {
              return {
                  ...g,
                  scripts: g.scripts.map(s => {
                      if (s.id === scriptId && s.params) {
                          return {
                              ...s,
                              params: s.params.map(p => p.id === paramId ? { ...p, value: val } : p)
                          };
                      }
                      return s;
                  })
              };
          }
          return g;
      }));
  };

  return (
    <div className="flex h-screen bg-[#0d0d0f] text-zinc-100 font-sans overflow-hidden select-none">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-50" />
        
        {currentView === AppView.DASHBOARD && (
          <Dashboard 
            stats={stats} 
            setStats={setStats} 
            addLog={addLog} 
            onOpenHub={() => setShowScriptHub(true)} 
            settings={settings}
            setSettings={setSettings}
          />
        )}
        {currentView === AppView.EDITOR && (
          <ScriptEditor addLog={addLog} enabledPlugins={plugins.filter(p => p.enabled)} />
        )}
        {currentView === AppView.SECURITY && (
          <SecuritySuite addLog={addLog} enabledPlugins={plugins} />
        )}
        {currentView === AppView.PLUGINS && (
          <PluginsPanel 
            addLog={addLog} 
            plugins={plugins} 
            setPlugins={setPlugins} 
            gameLibrary={gameLibrary}
            onToggleGame={handleToggleGame}
          />
        )}
        {currentView === AppView.LOGS && (
          <ConsoleLogs logs={logs} clearLogs={() => setLogs([])} />
        )}
        {currentView === AppView.SETTINGS && (
          <SettingsPanel settings={settings} setSettings={setSettings} stats={stats} />
        )}
      </main>

      {showScriptHub && stats.processStatus === 'INJECTED' && (
        <ScriptHub 
            game={gameLibrary.find(g => g.id === 'roblox')!} 
            currentPlatform={stats.currentPlatform}
            onClose={() => setShowScriptHub(false)}
            onToggleScript={handleToggleScript}
            onUpdateParam={handleUpdateParam}
        />
      )}
    </div>
  );
};

export default App;

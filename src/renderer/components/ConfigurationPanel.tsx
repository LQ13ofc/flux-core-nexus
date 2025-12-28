
import React from 'react';
import { Settings, Zap, FolderOpen, Target, Cpu } from 'lucide-react';
import { useInjection } from '../context/InjectionContext';
import { InjectionMethod } from '../../types';

const ConfigurationPanel: React.FC = () => {
  const { 
    processName, setProcessName, 
    dllPath, setDllPath, 
    method, setMethod, 
    status, setStatus,
    isInjecting, setIsInjecting, 
    addLog 
  } = useInjection();

  const handleSelectDLL = async () => {
    try {
        const path = await window.fluxAPI.selectFile();
        if (path) {
            setDllPath(path);
            addLog(`Selected DLL: ${path}`, 'INFO');
        }
    } catch (e) {
        addLog('Error selecting file', 'ERROR');
    }
  };

  const handleInject = async () => {
    if (!dllPath) {
        addLog('No DLL selected. Aborting.', 'WARN');
        return;
    }
    
    setIsInjecting(true);
    setStatus('Initializing...');
    addLog(`Starting injection sequence for ${processName}...`, 'INFO');
    
    try {
        const result = await window.fluxAPI.inject({
            processName,
            dllPath,
            method
        });

        if (result.success) {
            setStatus('Injected');
            addLog(`Injection Successful! PID: ${result.pid}`, 'SUCCESS');
            addLog('Kernel hook established.', 'SUCCESS');
        } else {
            setStatus('Failed');
            addLog(`Injection Failed: ${result.error}`, 'ERROR');
        }
    } catch (e: any) {
        setStatus('Error');
        addLog(`Critical Failure: ${e.message}`, 'ERROR');
    } finally {
        setIsInjecting(false);
    }
  };

  return (
    <div className="h-full bg-gray-800/30 rounded-xl backdrop-blur-md border border-gray-700/50 flex flex-col p-5 shadow-inner">
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
        <Settings className="w-5 h-5 text-gray-400" />
        <h2 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Configuration</h2>
      </div>

      <div className="space-y-6 flex-1">
        {/* Target Process */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Target size={12} /> Target Process
            </label>
            <input
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className="w-full bg-black/40 border border-gray-700/50 rounded-lg px-3 py-2.5 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all placeholder-gray-700"
                placeholder="Ex: RobloxPlayerBeta.exe"
            />
        </div>

        {/* DLL Path */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <FolderOpen size={12} /> Payload (DLL)
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={dllPath}
                    readOnly
                    className="flex-1 bg-black/40 border border-gray-700/50 rounded-lg px-3 py-2.5 text-xs text-gray-300 font-mono outline-none truncate"
                    placeholder="No file selected"
                />
                <button
                    onClick={handleSelectDLL}
                    className="px-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 rounded-lg text-xs font-bold transition-colors"
                >
                    ...
                </button>
            </div>
        </div>

        {/* Injection Method */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Cpu size={12} /> Injection Strategy
            </label>
            <div className="grid grid-cols-1 gap-2">
                {[
                    { val: InjectionMethod.MANUAL_MAP, label: "Manual Mapping (Stealth)" },
                    { val: InjectionMethod.PROCESS_HOLLOWING, label: "Process Hollowing" },
                    { val: InjectionMethod.THREAD_HIJACKING, label: "Thread Hijacking" },
                    { val: InjectionMethod.APC_INJECTION, label: "APC Injection" }
                ].map((opt) => (
                    <button
                        key={opt.val}
                        onClick={() => setMethod(opt.val)}
                        className={`text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                            method === opt.val 
                            ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400' 
                            : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Status Display */}
        <div className="p-3 bg-black/40 rounded-lg border border-gray-800 flex justify-between items-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Engine Status</span>
            <span className={`text-xs font-bold ${
                status === 'Injected' ? 'text-green-500' : 
                status === 'Failed' || status === 'Error' ? 'text-red-500' : 
                status === 'Initializing...' ? 'text-yellow-500' : 'text-gray-400'
            }`}>
                {status}
            </span>
        </div>

        {/* Inject Button */}
        <button
            onClick={handleInject}
            disabled={isInjecting}
            className={`w-full py-3.5 rounded-lg font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                isInjecting 
                ? 'bg-gray-800 text-gray-500 cursor-wait' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/20 active:scale-95'
            }`}
        >
            <Zap className={`w-4 h-4 ${isInjecting ? 'animate-pulse' : 'fill-current'}`} />
            {isInjecting ? 'EXECUTING...' : 'INJECT PAYLOAD'}
        </button>
      </div>
    </div>
  );
};

export default ConfigurationPanel;

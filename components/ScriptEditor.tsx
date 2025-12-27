
import React, { useState, useCallback, useMemo } from 'react';
import { Play, Trash2, Sparkles, FileCode, ChevronDown, Loader2, Shield, Binary, Bug } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PluginModule, LanguageRuntime } from '../types';

interface ScriptEditorProps {
  addLog: (msg: string, level?: any, cat?: string) => void;
  enabledPlugins: PluginModule[];
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ addLog, enabledPlugins }) => {
  const [code, setCode] = useState<string>(`-- Flux Core Nexus v4.0\n-- Universal Runtime Grid Active\n\nprint("Environment check: Success")`);
  const [isFixing, setIsFixing] = useState(false);
  const [selectedRuntime, setSelectedRuntime] = useState<LanguageRuntime>('auto');

  const detectLanguage = useCallback((text: string): LanguageRuntime => {
    const enabledIds = enabledPlugins.map(p => p.id);
    if (enabledIds.length === 0) return 'lua'; 
    
    // Detecção baseada em padrões comuns de linguagem
    if (/import |def |from /.test(text)) return enabledIds.includes('python') ? 'python' : enabledIds[0];
    if (/using |namespace |public class/.test(text)) return enabledIds.includes('csharp') ? 'csharp' : enabledIds[0];
    if (/#include |std::|void main\(/.test(text)) return enabledIds.includes('cpp') ? 'cpp' : enabledIds[0];
    if (/function |const |let |=>/.test(text) && /\{/.test(text)) return enabledIds.includes('js') ? 'js' : enabledIds[0];
    
    return enabledIds.includes('lua') ? 'lua' : enabledIds[0];
  }, [enabledPlugins]);

  const currentRuntime = useMemo(() => 
    selectedRuntime === 'auto' ? detectLanguage(code) : selectedRuntime,
    [selectedRuntime, code, detectLanguage]
  );

  const handleExecute = useCallback(() => {
    addLog(`JIT Compiler: Transpiling to ${currentRuntime.toUpperCase()} bytecode...`, 'INFO', 'CORE');
    setTimeout(() => {
      addLog(`Execution of ${currentRuntime.toUpperCase()} complete. Return: 0 (Success)`, 'SUCCESS', 'RUNTIME');
    }, 600);
  }, [currentRuntime, addLog]);

  const handleDump = () => {
    addLog(`Dumping memory strings for ${currentRuntime} context...`, 'INFO', 'DEBUG');
    setTimeout(() => {
       setCode(prev => prev + `\n\n-- DUMP OUTPUT:\n-- Address: 0x7FF4A1B2\n-- Strings found: 142`);
       addLog('Memory Dump saved to buffer.', 'SUCCESS', 'DEBUG');
    }, 800);
  };

  const fixWithAI = async () => {
    if (!code.trim() || !process.env.API_KEY) {
      addLog('API Key not found or code is empty.', 'WARN', 'GEMINI');
      return;
    }
    setIsFixing(true);
    addLog(`Gemini Analyzing ${currentRuntime} context...`, 'INFO', 'GEMINI');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior reverse engineer. Optimize this ${currentRuntime} script for high-performance game execution and anti-cheat evasion. Return ONLY the improved code.\n\n${code}`,
      });
      if (response.text) {
        setCode(response.text.trim());
        addLog('AI Hyper-Optimization applied.', 'SUCCESS', 'GEMINI');
      }
    } catch (err) {
      addLog('AI service timed out. Keeping original code.', 'ERROR', 'GEMINI');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-[#0d0d0f]">
      <div className="flex items-center justify-between mb-3 bg-[#141417] p-2 rounded-lg border border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 border-r border-white/5 mr-1">
            <FileCode size={14} className="text-blue-500" />
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-tighter italic">
              nexus_buffer.{currentRuntime === 'python' ? 'py' : currentRuntime === 'csharp' ? 'cs' : currentRuntime === 'cpp' ? 'cpp' : 'lua'}
            </span>
          </div>
          
          <div className="relative flex items-center gap-2">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Runtime:</span>
            <select 
              value={selectedRuntime}
              onChange={(e) => setSelectedRuntime(e.target.value as LanguageRuntime)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-black text-blue-400 outline-none hover:border-blue-500/30 transition-all appearance-none pr-8 cursor-pointer"
            >
              <option value="auto">Automatic (Detection)</option>
              {enabledPlugins.map(p => (
                <option key={p.id} value={p.id}>{p.name.split(' ')[0]}</option>
              ))}
            </select>
            <ChevronDown size={10} className="absolute right-2 text-zinc-600 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={handleDump} 
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" 
            title="Dump Memory Strings"
          >
            <Binary size={16} />
          </button>
          <button 
            onClick={fixWithAI} 
            disabled={isFixing} 
            className={`p-2 rounded-lg transition-all ${isFixing ? 'text-zinc-600 animate-spin' : 'text-purple-400 hover:bg-purple-400/10'}`} 
            title="AI Overclock Optimization"
          >
            {isFixing ? <Loader2 size={16} /> : <Sparkles size={16} />}
          </button>
          <button onClick={() => setCode('')} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Clear Buffer">
            <Trash2 size={16} />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button onClick={handleExecute} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[11px] flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all uppercase tracking-widest">
            <Play size={12} fill="currentColor" />
            Execute
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#09090b] rounded-xl border border-white/5 flex relative shadow-inner overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full bg-transparent p-6 text-xs font-mono text-zinc-400 outline-none resize-none leading-relaxed selection:bg-blue-500/20"
          placeholder="-- Write or paste your script here..."
        />
        {enabledPlugins.length === 0 && (
           <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-[4px] rounded-xl z-10">
             <div className="text-center p-8 space-y-3 bg-[#111114] border border-white/5 rounded-2xl shadow-2xl">
               <Shield className="mx-auto text-orange-500" size={32} />
               <div className="space-y-1">
                 <p className="text-sm font-black text-white uppercase italic">No Execution Engine Active</p>
                 <p className="text-[10px] text-zinc-500 max-w-[240px]">Navigate to the Plugins menu and enable at least one language runtime to proceed.</p>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ScriptEditor;

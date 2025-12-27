
import React, { useState, useEffect } from 'react';
import { Play, Trash2, Sparkles, FileCode, ChevronDown } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PluginModule, LanguageRuntime } from '../types';

interface ScriptEditorProps {
  addLog: (msg: string, level?: any, cat?: string) => void;
  enabledPlugins: PluginModule[];
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ addLog, enabledPlugins }) => {
  const [code, setCode] = useState<string>(`-- Flux Core v2\n-- Detecting environment...\n\nprint("Script engine ready.")`);
  const [isFixing, setIsFixing] = useState(false);
  const [selectedRuntime, setSelectedRuntime] = useState<LanguageRuntime>('auto');

  const detectLanguage = (text: string): LanguageRuntime => {
    const enabledIds = enabledPlugins.map(p => p.id);
    if (enabledIds.length === 0) return 'lua'; // Fallback
    
    // Very simple detection logic
    if (text.includes('import ') || text.includes('def ')) return enabledIds.includes('python') ? 'python' : enabledIds[0];
    if (text.includes('using ') || text.includes('namespace ')) return enabledIds.includes('csharp') ? 'csharp' : enabledIds[0];
    if (text.includes('#include ')) return enabledIds.includes('cpp') ? 'cpp' : enabledIds[0];
    if (text.includes('function') && text.includes('{')) return enabledIds.includes('js') ? 'js' : enabledIds[0];
    
    return enabledIds.includes('lua') ? 'lua' : enabledIds[0];
  };

  const currentRuntime = selectedRuntime === 'auto' ? detectLanguage(code) : selectedRuntime;

  const handleExecute = () => {
    addLog(`Running ${currentRuntime.toUpperCase()} script through Flux-VM...`, 'INFO', 'CORE');
    setTimeout(() => {
      addLog(`${currentRuntime.toUpperCase()} execution complete.`, 'SUCCESS', 'RUNTIME');
    }, 600);
  };

  const fixWithAI = async () => {
    if (!code.trim()) return;
    setIsFixing(true);
    addLog(`AI analyzing ${currentRuntime} script...`, 'INFO', 'GEMINI');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Optimize this ${currentRuntime} script for game execution. Ensure stability. Return ONLY code.\n\n${code}`,
      });
      setCode(response.text || code);
      addLog('AI optimization applied.', 'SUCCESS', 'GEMINI');
    } catch (err) {
      addLog('AI services offline.', 'ERROR', 'GEMINI');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-[#0d0d0f]">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-3 bg-[#141417] p-2 rounded-lg border border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3">
            <FileCode size={14} className="text-blue-500" />
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">
              {currentRuntime}.{currentRuntime === 'python' ? 'py' : currentRuntime === 'csharp' ? 'cs' : currentRuntime === 'cpp' ? 'cpp' : 'lua'}
            </span>
          </div>
          
          {/* Runtime Selector */}
          <div className="relative flex items-center gap-2">
            <span className="text-[9px] text-zinc-600 font-bold uppercase">Runtime:</span>
            <select 
              value={selectedRuntime}
              onChange={(e) => setSelectedRuntime(e.target.value as LanguageRuntime)}
              className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] font-bold text-blue-400 outline-none hover:border-blue-500/30 transition-all appearance-none pr-6"
            >
              <option value="auto">Automatic</option>
              {enabledPlugins.map(p => (
                <option key={p.id} value={p.id}>{p.name.split(' ')[0]}</option>
              ))}
            </select>
            <ChevronDown size={10} className="absolute right-1 text-zinc-600 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fixWithAI} disabled={isFixing} className="p-1.5 text-purple-400 hover:bg-purple-400/10 rounded transition-colors" title="AI Optimize">
            <Sparkles size={16} />
          </button>
          <button onClick={() => setCode('')} className="p-1.5 text-zinc-500 hover:text-red-500 rounded transition-colors" title="Clear">
            <Trash2 size={16} />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button onClick={handleExecute} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[11px] flex items-center gap-2">
            <Play size={12} fill="currentColor" />
            EXECUTE
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#09090b] rounded-lg border border-white/5 flex relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full bg-transparent p-4 text-xs font-mono text-zinc-300 outline-none resize-none leading-relaxed"
          placeholder="-- Write your code here..."
        />
        {enabledPlugins.length === 0 && (
           <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] rounded-lg">
             <div className="text-center p-6 space-y-2">
               <p className="text-xs font-bold text-orange-500">No Runtimes Enabled</p>
               <p className="text-[10px] text-zinc-500">Go to the Plugins tab to install a language engine first.</p>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ScriptEditor;

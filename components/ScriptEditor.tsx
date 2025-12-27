
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Trash2, 
  Bug, 
  Save, 
  FileCode, 
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ScriptEditorProps {
  addLog: (msg: string, level?: any, cat?: string) => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ addLog }) => {
  const [code, setCode] = useState<string>(`-- BluePrint Supremo Default Script
-- Luau VM Interaction Module

local function InitializeBypass()
    print("Initializing environment...")
    cheat.readMemory(0x0, 100) -- Internal C Call simulation
end

InitializeBypass()
print("Hello, user! Ready to execute.")`);

  const [isFixing, setIsFixing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleExecute = () => {
    addLog('Pre-processing script for bytecode conversion...', 'INFO', 'LUA_VM');
    setTimeout(() => {
      addLog('Injecting payload into target VM state...', 'INFO', 'LUA_VM');
      addLog('Execution successful. Returned status LUA_OK', 'SUCCESS', 'LUA_VM');
    }, 1200);
  };

  const fixWithAI = async () => {
    if (!code.trim()) return;
    setIsFixing(true);
    addLog('Gemini AI analyzing script for vulnerabilities and errors...', 'INFO', 'AI_DEBUGGER');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert Luau/Lua developer for game exploitation. 
        Optimize this script for performance and detect any potential anti-cheat triggers. 
        Return ONLY the updated Lua code, no explanation. 
        Script:
        ${code}`,
      });

      const fixedCode = response.text || code;
      setCode(fixedCode);
      addLog('Gemini AI: Optimization and bug-fixing complete.', 'SUCCESS', 'AI_DEBUGGER');
    } catch (err) {
      addLog('Failed to connect to Gemini AI services.', 'ERROR', 'AI_DEBUGGER');
    } finally {
      setIsFixing(false);
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="h-full flex flex-col p-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-4 bg-[#121216] p-2 rounded-xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg">
            <FileCode size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-white">main.lua</span>
          </div>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <Save size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fixWithAI}
            disabled={isFixing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600/10 text-purple-400 border border-purple-600/20 hover:bg-purple-600/20 transition-all text-xs font-bold disabled:opacity-50"
          >
            {isFixing ? (
              <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles size={14} fill="currentColor" />
            )}
            {isFixing ? 'AI Analyzing...' : 'AI Fix & Optimize'}
          </button>
          
          <button 
            onClick={() => setCode('')}
            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          <button 
            onClick={handleExecute}
            className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-xs font-bold glow-blue shadow-lg"
          >
            <Play size={14} fill="currentColor" />
            Run Script
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden bg-[#0d0d11] rounded-2xl border border-white/5 shadow-2xl relative">
        {/* Line Numbers */}
        <div className="w-12 bg-black/40 border-r border-white/5 flex flex-col items-end pt-4 pr-3 text-[11px] font-mono text-zinc-600 select-none">
          {Array.from({ length: Math.max(lineCount, 30) }).map((_, i) => (
            <div key={i} className="h-[21px]">{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <div className="flex-1 relative group">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-transparent p-4 text-sm font-mono text-blue-100/90 outline-none resize-none leading-[21px] selection:bg-blue-500/20"
            placeholder="-- Paste your Lua script here..."
          />
          {/* Subtle Glow Overlay */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] pointer-events-none group-focus-within:opacity-100 opacity-30 transition-opacity" />
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-4">
          <span>LINES: {lineCount}</span>
          <span>MODE: LUAU-LITE</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
          <span>LUA_STATE RETRIEVED @ 0x7FF8...</span>
        </div>
      </div>
    </div>
  );
};

export default ScriptEditor;

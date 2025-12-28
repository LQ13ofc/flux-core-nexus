import React from 'react';
import { Terminal, Trash2, Search } from 'lucide-react';
import { LogEntry } from '../types';

interface ConsoleLogsProps {
  logs: LogEntry[];
  clearLogs: () => void;
}

const ConsoleLogs: React.FC<ConsoleLogsProps> = ({ logs, clearLogs }) => {
  return (
    <div className="h-full flex flex-col p-8 max-w-7xl mx-auto w-full gap-6">
      <div className="flex items-center justify-between bg-[#141417] p-4 rounded-2xl border border-white/5 shadow-lg shrink-0">
        <div className="flex items-center gap-3 px-2">
          <Terminal className="text-blue-500" size={20} />
          <div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase italic">System Logs</h2>
            <p className="text-[10px] text-zinc-500 font-medium">Real-time kernel events & errors</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search logs..."
                className="bg-[#0b0b0d] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-mono text-zinc-300 outline-none focus:border-blue-500/50 w-64 transition-all"
              />
           </div>
           <button 
             onClick={clearLogs}
             className="p-2.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
             title="Clear Logs"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0d0d11] border border-white/5 rounded-2xl overflow-hidden shadow-inner flex flex-col ring-1 ring-white/[0.02]">
        {/* Table Header */}
        <div className="grid grid-cols-[100px_80px_100px_1fr] border-b border-white/5 bg-white/[0.02] p-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
          <div>Timestamp</div>
          <div>Level</div>
          <div>Category</div>
          <div>Message</div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-auto font-mono text-[11px] custom-scrollbar">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
              <Terminal size={64} className="text-zinc-600" />
              <p className="font-bold tracking-widest uppercase text-xs text-zinc-500">Waiting for incoming data stream</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="grid grid-cols-[100px_80px_100px_1fr] p-3 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors items-start group">
                <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">{log.timestamp}</div>
                <div className={`font-bold tracking-wide ${
                  log.level === 'SUCCESS' ? 'text-green-500' : 
                  log.level === 'ERROR' ? 'text-red-500' : 
                  log.level === 'WARN' ? 'text-orange-500' : 
                  log.level === 'CRITICAL' ? 'text-purple-500' : 'text-blue-400'
                }`}>
                  {log.level}
                </div>
                <div className="text-zinc-500">[{log.category}]</div>
                <div className={`${log.level === 'ERROR' ? 'text-red-200/80' : 'text-zinc-300'} break-all`}>
                  {log.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsoleLogs;

import React from 'react';
import { Terminal, Trash2, Search, Filter } from 'lucide-react';
import { LogEntry } from '../types';

interface ConsoleLogsProps {
  logs: LogEntry[];
  clearLogs: () => void;
}

const ConsoleLogs: React.FC<ConsoleLogsProps> = ({ logs, clearLogs }) => {
  return (
    <div className="h-full flex flex-col p-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Terminal className="text-blue-500" />
          <h2 className="text-2xl font-bold text-white tracking-tight">System Logs</h2>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search logs..."
                className="bg-[#121216] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-zinc-300 outline-none focus:border-blue-500/50 w-64"
              />
           </div>
           <button 
             onClick={clearLogs}
             className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
             title="Clear Logs"
           >
             <Trash2 size={18} />
           </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0d0d11] border border-white/5 rounded-2xl overflow-hidden shadow-inner flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-[100px_100px_120px_1fr] border-b border-white/5 bg-white/5 p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <div>Timestamp</div>
          <div>Level</div>
          <div>Category</div>
          <div>Message</div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-auto font-mono text-xs">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Terminal size={48} className="mb-4" />
              <p className="font-bold tracking-widest uppercase text-sm">Waiting for incoming data stream</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="grid grid-cols-[100px_100px_120px_1fr] p-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-start">
                <div className="text-zinc-600">{log.timestamp}</div>
                <div className={`font-bold ${
                  log.level === 'SUCCESS' ? 'text-green-500' : 
                  log.level === 'ERROR' ? 'text-red-500' : 
                  log.level === 'WARN' ? 'text-orange-500' : 'text-blue-400'
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

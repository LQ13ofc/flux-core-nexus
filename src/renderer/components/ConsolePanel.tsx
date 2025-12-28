
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { useInjection } from '../context/InjectionContext';

const ConsolePanel: React.FC = () => {
  const { logs } = useInjection();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full bg-gray-900/40 rounded-xl backdrop-blur-sm border border-gray-700/50 flex flex-col overflow-hidden">
        <div className="h-10 bg-black/20 border-b border-white/5 flex items-center px-4 gap-2">
            <Terminal size={14} className="text-gray-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kernel Output</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 custom-scrollbar">
            {logs.length === 0 && (
                <div className="text-gray-600 italic">Waiting for injection command...</div>
            )}
            {logs.map((log, i) => (
                <div key={i} className="flex gap-3 hover:bg-white/[0.02] p-0.5 rounded">
                    <span className="text-gray-600 select-none">[{log.time}]</span>
                    <span className={`${
                        log.type === 'SUCCESS' ? 'text-green-400' :
                        log.type === 'ERROR' ? 'text-red-400' :
                        log.type === 'WARN' ? 'text-yellow-400' :
                        'text-cyan-200'
                    } break-all`}>
                        {log.msg}
                    </span>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    </div>
  );
};

export default ConsolePanel;

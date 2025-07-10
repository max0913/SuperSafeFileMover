
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

const levelClasses = {
  INFO: 'text-slate-400',
  SUCCESS: 'text-emerald-400',
  ERROR: 'text-red-400',
  WARN: 'text-amber-400',
};

const levelIndicatorClasses = {
    INFO: 'bg-blue-500',
    SUCCESS: 'bg-emerald-500',
    ERROR: 'bg-red-500',
    WARN: 'bg-amber-500',
};


export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-48 flex flex-col bg-slate-950/70 border border-slate-700 rounded-lg">
      <div className="px-4 py-2 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-200">Transaction Log</h3>
      </div>
      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto font-mono text-xs leading-relaxed">
        {logs.map((log, index) => (
          <div key={index} className={`flex items-start ${levelClasses[log.level]}`}>
            <span className={`flex-shrink-0 w-1.5 h-4 mt-0.5 mr-3 rounded-full ${levelIndicatorClasses[log.level]}`}></span>
            <span className="flex-shrink-0 mr-3 text-slate-500">
              {log.timestamp.toLocaleTimeString()}
            </span>
            <p className="flex-grow break-words whitespace-pre-wrap">{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export function LogsPanel({ logs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="logs-panel">
      <div className="logs-header">
        <Terminal size={15} /> Protocol Logs
      </div>
      <div className="logs-content" ref={containerRef}>
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.5 }}>Waiting for initialization...</div>
        ) : (
          logs.map((log, idx) => (
             <div key={idx} className="log-item">
               <span className="log-time">[{log.time}]</span>
               <span className={`log-msg ${log.highlight ? 'highlight' : ''}`}>
                 {log.msg}
               </span>
             </div>
          ))
        )}
      </div>
    </div>
  );
}

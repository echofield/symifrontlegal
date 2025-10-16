import { useState, useEffect } from 'react';
import { LexClient } from '../lib/lexClient';

export function SystemStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        await LexClient.health();
        setStatus('online');
        setLastCheck(new Date());
      } catch {
        setStatus('offline');
        setLastCheck(new Date());
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border px-3 py-2">
        <div 
          className={`w-1.5 h-1.5 rounded-full ${
            status === 'online' ? 'bg-accent animate-pulse' : 'bg-destructive'
          }`} 
        />
        <span 
          className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground"
          style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
        >
          {status === 'online' ? 'System Online' : 'System Offline'}
        </span>
      </div>
    </div>
  );
}

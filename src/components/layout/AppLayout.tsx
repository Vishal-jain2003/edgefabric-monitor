import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { StatusBadge } from '../edgefabric/StatusBadge';
import { getSystemHealth } from '@/api/cache';
import { Menu } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/cache': 'Cache Explorer',
  '/nodes': 'Cluster Nodes',
  '/metrics': 'Metrics',
  '/replication': 'Replication',
  '/persistence': 'WAL & Snapshots',
  '/gossip': 'Gossip / SWIM',
  '/rebalancer': 'Rebalancer',
  '/traffic': 'Traffic Control',
  '/security': 'Security',
  '/chaos': 'Chaos Testing',
  '/agent': 'MCP Agent',
  '/cicd': 'CI/CD',
  '/docs': 'Docs & ADRs',
};

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'EdgeFabric';
  const [lastSync, setLastSync] = useState(new Date());
  const [clusterStatus, setClusterStatus] = useState<string>('HEALTHY');

  useEffect(() => {
    const poll = async () => {
      try {
        const h = await getSystemHealth();
        setClusterStatus(h.data.status === 'UP' ? 'HEALTHY' : 'DEGRADED');
        setLastSync(new Date());
      } catch {
        setClusterStatus('CRITICAL');
      }
    };
    poll();
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex-1 ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-12 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-semibold text-sm text-foreground">{title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={clusterStatus} />
            <span className="text-[10px] text-muted-foreground font-mono">
              Last sync: {lastSync.toLocaleTimeString()}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 relative z-10 animate-fade-slide">
          {children}
        </main>
      </div>
    </div>
  );
}

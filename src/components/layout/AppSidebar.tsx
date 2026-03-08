import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Search, Server, BarChart3, RefreshCw,
  HardDrive, Globe, Scale, ArrowLeftRight, Shield, Zap, Bot, Wrench, BookOpen,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { getActiveNodes, getSystemHealth } from '@/api/cache';

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Cache Explorer", path: "/cache", icon: Search },
  { title: "Cluster Nodes", path: "/nodes", icon: Server },
  { title: "Metrics", path: "/metrics", icon: BarChart3 },
  { title: "Replication", path: "/replication", icon: RefreshCw },
  { title: "WAL & Snapshots", path: "/persistence", icon: HardDrive },
  { title: "Gossip / SWIM", path: "/gossip", icon: Globe },
  { title: "Rebalancer", path: "/rebalancer", icon: Scale },
  { title: "Traffic Control", path: "/traffic", icon: ArrowLeftRight },
  { title: "Security", path: "/security", icon: Shield },
  { title: "Chaos Testing", path: "/chaos", icon: Zap },
  { title: "MCP Agent", path: "/agent", icon: Bot },
  { title: "CI/CD", path: "/cicd", icon: Wrench },
  { title: "Docs & ADRs", path: "/docs", icon: BookOpen },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [nodeCount, setNodeCount] = useState(3);
  const [registryVersion, setRegistryVersion] = useState(5);
  const [healthStatus, setHealthStatus] = useState<'UP' | 'DOWN'>('UP');

  useEffect(() => {
    const poll = async () => {
      try {
        const [nodes, health] = await Promise.all([getActiveNodes(), getSystemHealth()]);
        setNodeCount(nodes.data.activeNodes?.length || 3);
        setRegistryVersion(nodes.data.registryVersion || 5);
        setHealthStatus(health.data.status === 'UP' ? 'UP' : 'DOWN');
      } catch {}
    };
    poll();
    const id = setInterval(poll, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className={`fixed left-0 top-0 h-screen flex flex-col border-r border-border bg-card/90 backdrop-blur-xl z-50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="font-display font-bold text-lg text-foreground tracking-tight">
              Edge<span className="text-ef-cyan">Fabric</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">Distributed Cache Platform</p>
          </div>
        )}
        {collapsed && <span className="text-ef-cyan font-display font-bold text-lg mx-auto">E</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground p-1">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-[12px] transition-all duration-200 ${
                active
                  ? 'bg-ef-cyan/10 text-ef-cyan border border-ef-cyan/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
              }`}
            >
              <item.icon size={16} className={active ? 'text-ef-cyan' : ''} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${healthStatus === 'UP' ? 'bg-ef-green animate-pulse-glow' : 'bg-ef-red'}`} />
            <span className="text-[11px] font-medium text-foreground">EdgeFabric {healthStatus === 'UP' ? 'LIVE' : 'DOWN'}</span>
          </div>
          <div className="text-[10px] text-muted-foreground space-y-0.5">
            <p>Active Nodes: <span className="text-foreground font-mono">{nodeCount}</span></p>
            <p>Registry v<span className="text-foreground font-mono">{registryVersion}</span></p>
          </div>
          {/* Sprint progress */}
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground">Sprint 2 / 6</p>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-ef-cyan rounded-full" style={{ width: '33%' }} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

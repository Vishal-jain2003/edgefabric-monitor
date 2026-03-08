import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { NodeCard } from '@/components/edgefabric/NodeCard';
import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { LiveBadge } from '@/components/edgefabric/LiveBadge';
import { useOperations } from '@/context/OperationsContext';
import { getActiveNodes } from '@/api/cache';
import { MOCK_NODES, MOCK_METRICS, MOCK_HIT_RATE_HISTORY, MOCK_LATENCY_HISTORY } from '@/mock/mockData';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

const sprints = [
  { num: 1, name: "Core Cache", done: true },
  { num: 2, name: "Replication + Frontend", current: true },
  { num: 3, name: "Gossip/SWIM + Metrics", done: false },
  { num: 4, name: "WAL/Snapshots + Rebalancer", done: false },
  { num: 5, name: "Security + gRPC", done: false },
  { num: 6, name: "MCP Agent + Chaos + CI/CD", done: false },
];

export default function Dashboard() {
  const [nodeCount, setNodeCount] = useState(3);
  const [registryVersion, setRegistryVersion] = useState(5);
  const [source, setSource] = useState<'live' | 'mock'>('mock');
  const { operations } = useOperations();

  useEffect(() => {
    const poll = async () => {
      const res = await getActiveNodes();
      setNodeCount(res.data.activeNodes?.length || 3);
      setRegistryVersion(res.data.registryVersion || 5);
      setSource(res.source);
    };
    poll();
    const id = setInterval(poll, 10000);
    return () => clearInterval(id);
  }, []);

  const clusterStatus = MOCK_NODES.every(n => n.status === 'HEALTHY') ? 'HEALTHY' : 'DEGRADED';

  return (
    <div className="space-y-6">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Active Nodes" value={nodeCount} color="cyan" live={source === 'live'} />
        <MetricCard label="Registry Version" value={`v${registryVersion}`} color="blue" live={source === 'live'} />
        <MetricCard label="Cluster Status" value={clusterStatus} color={clusterStatus === 'HEALTHY' ? 'green' : 'amber'} live={source === 'live'} />
        <MetricCard label="Hit Rate" value={`${MOCK_METRICS.hitRate}%`} color="green" trend="+1.2% vs 1h ago" />
        <MetricCard label="P95 Latency" value={`${MOCK_METRICS.p95Latency}ms`} color="cyan" trend="-0.3ms" />
        <MetricCard label="Availability" value={`${MOCK_METRICS.availability}%`} color="green" />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-sm text-foreground">Hit Rate (24h)</h3>
            <SimulatedBadge sprint={3} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_HIT_RATE_HISTORY}>
              <defs>
                <linearGradient id="hitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E676" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#8899AA' }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#8899AA' }} />
              <Tooltip contentStyle={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <Area type="monotone" dataKey="rate" stroke="#00E676" fill="url(#hitGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-sm text-foreground">Latency (30m)</h3>
            <SimulatedBadge sprint={3} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_LATENCY_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8899AA' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8899AA' }} />
              <Tooltip contentStyle={{ background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <Line type="monotone" dataKey="p50" stroke="#00E5FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p95" stroke="#FFB300" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p99" stroke="#FF1744" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-ef-cyan inline-block" /> P50</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-ef-amber inline-block" /> P95</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-ef-red inline-block" /> P99</span>
          </div>
        </div>
      </div>

      {/* Row 3: Node cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-sm text-foreground">Node Health</h3>
          <Link to="/nodes" className="text-[11px] text-ef-cyan hover:underline flex items-center gap-1">
            View Details <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_NODES.map(node => (
            <NodeCard key={node.id} node={node} />
          ))}
        </div>
      </div>

      {/* Row 4: Recent Operations */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-sm text-foreground">Recent Operations</h3>
          <LiveBadge />
        </div>
        {operations.length === 0 ? (
          <p className="text-[11px] text-muted-foreground py-4 text-center">No operations yet. Use the Cache Explorer to perform PUT/GET operations.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-1.5 px-2">Time</th>
                  <th className="text-left py-1.5 px-2">Method</th>
                  <th className="text-left py-1.5 px-2">Key</th>
                  <th className="text-left py-1.5 px-2">Tenant</th>
                  <th className="text-left py-1.5 px-2">Result</th>
                  <th className="text-right py-1.5 px-2">Latency</th>
                </tr>
              </thead>
              <tbody>
                {operations.slice(0, 10).map(op => (
                  <tr key={op.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-1.5 px-2 font-mono text-muted-foreground">{op.time}</td>
                    <td className="py-1.5 px-2"><span className={op.method === 'PUT' ? 'text-ef-blue' : op.method === 'GET' ? 'text-ef-green' : 'text-ef-red'}>{op.method}</span></td>
                    <td className="py-1.5 px-2 font-mono text-foreground">{op.key}</td>
                    <td className="py-1.5 px-2 text-muted-foreground">{op.tenant}</td>
                    <td className="py-1.5 px-2"><span className={op.result === 'HIT' || op.result === 'OK' ? 'text-ef-green' : op.result === 'MISS' ? 'text-ef-amber' : 'text-ef-red'}>{op.result}</span></td>
                    <td className="py-1.5 px-2 text-right font-mono">{op.latency}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 5: Sprint progress */}
      <div className="glass-card p-4">
        <h3 className="font-display font-semibold text-sm text-foreground mb-4">Sprint Roadmap</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {sprints.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`flex-shrink-0 rounded-lg p-3 min-w-[160px] border ${
                s.done ? 'border-ef-green/30 bg-ef-green/5' :
                s.current ? 'border-ef-cyan/30 bg-ef-cyan/5 glow-cyan' :
                'border-border bg-muted/20'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {s.done ? <CheckCircle size={14} className="text-ef-green" /> :
                   s.current ? <Circle size={14} className="text-ef-cyan animate-pulse-glow" /> :
                   <Circle size={14} className="text-muted-foreground" />}
                  <span className="text-[10px] text-muted-foreground">Sprint {s.num}</span>
                </div>
                <p className="text-[11px] font-medium text-foreground">{s.name}</p>
                {s.current && <span className="text-[9px] text-ef-cyan mt-1 block">← CURRENT</span>}
              </div>
              {i < sprints.length - 1 && <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

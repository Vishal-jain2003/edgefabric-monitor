import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { MOCK_METRICS, MOCK_CHAOS_HISTORY, MOCK_NODES } from '@/mock/mockData';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ChaosTest() {
  const [running, setRunning] = useState<string | null>(null);

  const runScenario = (type: string) => {
    setRunning(type);
    setTimeout(() => { setRunning(null); toast.success(`Chaos scenario "${type}" completed`); }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">Chaos Testing</h3>
        <SimulatedBadge sprint={6} />
      </div>

      {/* SLO during chaos */}
      <div className="glass-card p-4">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-3">SLO Monitoring During Chaos</h4>
        <div className="grid grid-cols-3 gap-3">
          <MetricCard label="Availability" value={`${MOCK_METRICS.availability}%`} color="green" />
          <MetricCard label="P95 Latency" value={`${MOCK_METRICS.p95Latency}ms`} color="green" />
          <MetricCard label="Hit Rate" value={`${MOCK_METRICS.hitRate}%`} color="green" />
        </div>
        <p className="text-[10px] text-ef-green mt-3">✓ System maintained SLOs during all chaos tests</p>
      </div>

      {/* Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { type: 'NODE_TERMINATION', icon: '💀', desc: 'Kill selected node process and observe recovery.' },
          { type: 'LATENCY_INJECTION', icon: '🐌', desc: 'Inject artificial latency into node responses.' },
          { type: 'PACKET_LOSS', icon: '📡', desc: 'Simulate network packet loss between nodes.' },
        ].map(s => (
          <div key={s.type} className="glass-card p-4 space-y-3">
            <h4 className="font-display text-[12px] font-semibold text-foreground">{s.icon} {s.type.replace(/_/g, ' ')}</h4>
            <p className="text-[10px] text-muted-foreground">{s.desc}</p>
            <button onClick={() => runScenario(s.type)} disabled={!!running}
              className="w-full text-[10px] py-1.5 rounded bg-ef-red/10 border border-ef-red/30 text-ef-red hover:bg-ef-red/20 disabled:opacity-40 transition-colors">
              {running === s.type ? 'Running...' : 'Run Scenario'}
            </button>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="glass-card p-5">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-3">Chaos History</h4>
        <table className="w-full text-[10px]">
          <thead><tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-1.5 px-2">Type</th>
            <th className="text-left py-1.5 px-2">Target</th>
            <th className="text-left py-1.5 px-2">Time</th>
            <th className="text-left py-1.5 px-2">Duration</th>
            <th className="text-left py-1.5 px-2">Impact</th>
            <th className="text-left py-1.5 px-2">SLO</th>
            <th className="text-left py-1.5 px-2">Status</th>
          </tr></thead>
          <tbody>
            {MOCK_CHAOS_HISTORY.map(c => (
              <tr key={c.id} className="border-b border-border/30">
                <td className="py-1.5 px-2 font-mono text-ef-red">{c.type}</td>
                <td className="py-1.5 px-2 font-mono text-ef-cyan">{c.target}</td>
                <td className="py-1.5 px-2 text-muted-foreground">{c.time}</td>
                <td className="py-1.5 px-2 font-mono">{c.duration}</td>
                <td className="py-1.5 px-2 text-muted-foreground">{c.impact}</td>
                <td className="py-1.5 px-2"><span className="text-ef-green">✓ OK</span></td>
                <td className="py-1.5 px-2 text-ef-green">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

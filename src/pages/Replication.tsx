import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MOCK_REPLICATION, MOCK_NODES } from '@/mock/mockData';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Replication() {
  const [rf, setRf] = useState(2);
  const quorums: Record<number, { w: number; r: number; tolerance: string }> = {
    1: { w: 1, r: 1, tolerance: 'No fault tolerance' },
    2: { w: 2, r: 1, tolerance: '1 node failure' },
    3: { w: 2, r: 2, tolerance: '1 node failure, quorum' },
    5: { w: 3, r: 3, tolerance: '2 node failures' },
  };
  const q = quorums[rf] || quorums[2];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">Replication</h3>
        <SimulatedBadge sprint={4} />
      </div>

      {/* RF Selector */}
      <div className="glass-card p-5 space-y-3">
        <h4 className="font-display text-[12px] font-semibold text-foreground">Replication Factor</h4>
        <div className="flex gap-2">
          {[1, 2, 3, 5].map(r => (
            <button key={r} onClick={() => setRf(r)}
              className={`px-4 py-2 rounded text-[12px] font-mono border transition-colors ${rf === r ? 'bg-ef-purple/10 border-ef-purple/30 text-ef-purple' : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'}`}>
              RF={r}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-muted-foreground font-mono">
          W={q.w}, R={q.r} · {q.tolerance}
        </div>
      </div>

      {/* Topology */}
      <div className="glass-card p-5">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-4">Replication Topology</h4>
        <div className="flex items-center justify-center gap-4 py-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-ef-blue/10 border-2 border-ef-blue flex items-center justify-center text-ef-blue text-[10px] font-mono">Write</div>
          </div>
          <div className="text-ef-blue animate-pulse-glow">→→→</div>
          {MOCK_NODES.map((node, i) => (
            <div key={node.id} className="flex items-center gap-4">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-[10px] font-mono ${
                  node.status === 'HEALTHY' ? 'bg-ef-green/10 border-ef-green text-ef-green' : 'bg-ef-amber/10 border-ef-amber text-ef-amber'
                }`}>{node.id}</div>
                <p className="text-[9px] text-muted-foreground mt-1">{MOCK_REPLICATION.syncLag}ms lag</p>
              </div>
              {i < MOCK_NODES.length - 1 && <div className="text-ef-purple animate-pulse-glow">→→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Sync Lag" value={`${MOCK_REPLICATION.syncLag}ms`} color="green" />
        <MetricCard label="Pending Repairs" value={MOCK_REPLICATION.pendingRepairs} color="amber" />
        <MetricCard label="Anti-Entropy" value="4m ago" color="green" />
        <MetricCard label="Replica Health" value={MOCK_REPLICATION.replicaHealth} color="green" />
      </div>

      <button onClick={() => toast.info('Mock: Read repair triggered')} className="text-[11px] px-3 py-1.5 rounded bg-ef-purple/10 border border-ef-purple/30 text-ef-purple hover:bg-ef-purple/20 transition-colors">
        Trigger Read Repair
      </button>
    </div>
  );
}

import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { HashRingViz } from '@/components/edgefabric/HashRingViz';
import { MOCK_REBALANCER, MOCK_NODES } from '@/mock/mockData';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Rebalancer() {
  const [calcCurrent, setCalcCurrent] = useState(3);
  const [calcNew, setCalcNew] = useState(4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">Rebalancer</h3>
        <SimulatedBadge sprint={5} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Status" value={MOCK_REBALANCER.status} color="green" />
        <MetricCard label="Last Event" value={MOCK_REBALANCER.lastEvent} color="blue" />
        <MetricCard label="Keys Moved" value={`${MOCK_REBALANCER.keysMovedLastRebalance}%`} color="green" />
        <MetricCard label="Pending Drains" value={MOCK_REBALANCER.pendingDrains} color="green" />
      </div>

      {/* Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Add Node', desc: 'After adding, the rebalancer will migrate ≤10% of keys.', btn: 'Add Node', color: 'cyan' },
          { title: 'Remove Node', desc: 'Keys will be redistributed before removal.', btn: 'Remove Node', color: 'red' },
          { title: 'Drain Node', desc: 'Gracefully migrates all keys off selected node.', btn: 'Drain Node', color: 'amber' },
          { title: 'Warm Up', desc: 'Pre-populates new node cache from hot keys.', btn: 'Start Warm-Up', color: 'green' },
        ].map(op => (
          <div key={op.title} className="glass-card p-4 space-y-3">
            <h4 className="font-display text-[12px] font-semibold text-foreground">{op.title}</h4>
            <p className="text-[10px] text-muted-foreground">{op.desc}</p>
            <button onClick={() => toast.info(`Mock: ${op.title} triggered`)}
              className={`text-[11px] px-3 py-1.5 rounded bg-ef-${op.color}/10 border border-ef-${op.color}/30 text-ef-${op.color} hover:bg-ef-${op.color}/20 transition-colors`}>
              {op.btn}
            </button>
          </div>
        ))}
      </div>

      {/* Hash Ring comparison */}
      <div className="glass-card p-5">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-4">Hash Ring Before / After</h4>
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground mb-2">Current (3 nodes)</p>
            <HashRingViz nodes={MOCK_NODES.map(n => ({ id: n.id, status: n.status }))} size={200} />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground mb-2">After Add (4 nodes)</p>
            <HashRingViz nodes={[...MOCK_NODES.map(n => ({ id: n.id, status: 'HEALTHY' })), { id: 'node-4', status: 'HEALTHY' }]} size={200} />
          </div>
        </div>
      </div>

      {/* Key Movement Calculator */}
      <div className="glass-card p-5 space-y-3">
        <h4 className="font-display text-[12px] font-semibold text-foreground">Key Movement Calculator</h4>
        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <label className="text-muted-foreground text-[10px]">Current nodes</label>
            <input type="number" value={calcCurrent} onChange={e => setCalcCurrent(+e.target.value)} min={1}
              className="w-20 bg-muted/50 border border-border rounded px-2 py-1 font-mono text-foreground text-center ml-2" />
          </div>
          <span className="text-muted-foreground">→</span>
          <div>
            <label className="text-muted-foreground text-[10px]">New nodes</label>
            <input type="number" value={calcNew} onChange={e => setCalcNew(+e.target.value)} min={1}
              className="w-20 bg-muted/50 border border-border rounded px-2 py-1 font-mono text-foreground text-center ml-2" />
          </div>
          <div className="ml-4">
            <span className="text-muted-foreground">Est. movement: </span>
            <span className="font-mono text-ef-cyan font-bold">{(100 / Math.max(calcNew, 1)).toFixed(1)}%</span>
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground font-mono">Formula: movement ≈ 1/new_nodes</p>
      </div>
    </div>
  );
}

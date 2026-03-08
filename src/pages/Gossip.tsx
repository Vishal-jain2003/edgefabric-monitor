import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { StatusBadge } from '@/components/edgefabric/StatusBadge';
import { MOCK_GOSSIP, MOCK_GOSSIP_LOG, MOCK_NODES } from '@/mock/mockData';

const stateColors: Record<string, string> = {
  ALIVE: 'border-ef-green text-ef-green bg-ef-green/10',
  SUSPECT: 'border-ef-amber text-ef-amber bg-ef-amber/10',
  FAILED: 'border-ef-red text-ef-red bg-ef-red/10',
  DEAD: 'border-muted-foreground text-muted-foreground bg-muted/30',
};

export default function Gossip() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">Gossip / SWIM</h3>
        <SimulatedBadge sprint={5} />
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard label="Protocol" value="SWIM" color="purple" />
        <MetricCard label="Rounds" value={MOCK_GOSSIP.roundsCompleted.toLocaleString()} color="cyan" />
        <MetricCard label="Convergence" value={`${MOCK_GOSSIP.convergenceMs}ms`} color="green" />
        <MetricCard label="Last Heartbeat" value={MOCK_GOSSIP.lastHeartbeat} color="cyan" />
        <MetricCard label="Membership v" value={MOCK_GOSSIP.membershipVersion} color="blue" />
        <MetricCard label="Suspect Nodes" value={MOCK_GOSSIP.suspectNodes.length} color={MOCK_GOSSIP.suspectNodes.length > 0 ? 'amber' : 'green'} />
      </div>

      {/* State machine */}
      <div className="glass-card p-5">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-4">Membership State</h4>
        <div className="flex items-center justify-center gap-8 py-4">
          {MOCK_NODES.map(node => {
            const state = node.status === 'HEALTHY' ? 'ALIVE' : 'SUSPECT';
            return (
              <div key={node.id} className="text-center">
                <div className={`w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center ${stateColors[state]}`}>
                  <span className="text-[10px] font-mono font-bold">{node.id}</span>
                  <span className="text-[9px] mt-0.5">{state}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground mt-2">
          <span className="text-ef-green">ALIVE</span> → <span className="text-ef-amber">SUSPECT</span> → <span className="text-ef-red">FAILED</span> → <span className="text-muted-foreground">DEAD</span>
        </div>
      </div>

      {/* Gossip Log */}
      <div className="glass-card p-5">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-3">Gossip Log</h4>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {MOCK_GOSSIP_LOG.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 text-[10px] py-1 border-b border-border/30 font-mono">
              <span className="text-muted-foreground w-24 flex-shrink-0">{entry.time}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                entry.event.includes('SUSPECT') ? 'text-ef-amber bg-ef-amber/10' :
                entry.event.includes('RECOVER') || entry.event.includes('ACK') ? 'text-ef-green bg-ef-green/10' :
                'text-ef-blue bg-ef-blue/10'
              }`}>{entry.event}</span>
              <span className="text-ef-cyan">{entry.source}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-ef-purple">{entry.target}</span>
              <span className="text-muted-foreground">{entry.details}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card p-5 space-y-3">
        <h4 className="font-display text-[12px] font-semibold text-foreground">Protocol Settings</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
          {[
            { label: 'Heartbeat Interval', value: '500ms' },
            { label: 'Suspect Timeout', value: '2000ms' },
            { label: 'Failure Timeout', value: '4000ms' },
            { label: 'Fanout', value: '3' },
          ].map(s => (
            <div key={s.label} className="space-y-1">
              <label className="text-muted-foreground text-[10px]">{s.label}</label>
              <div className="bg-muted/50 border border-border rounded px-3 py-1.5 font-mono text-foreground">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

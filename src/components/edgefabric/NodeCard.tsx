import { StatusBadge } from './StatusBadge';

interface NodeCardProps {
  node: {
    id: string;
    host: string;
    port: number;
    status: string;
    cpu: number;
    memory: number;
    keys: number;
    hitRate: number;
    replicaOf: string[];
    replicaFor: string[];
    uptime: string;
    region: string;
    version: string;
  };
  compact?: boolean;
}

function UsageBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct > 80 ? 'bg-ef-red' : pct > 60 ? 'bg-ef-amber' : 'bg-ef-green';
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function NodeCard({ node, compact }: NodeCardProps) {
  return (
    <div className="glass-card p-4 space-y-3 animate-count-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-foreground">{node.id}</p>
          <p className="text-[11px] text-muted-foreground font-mono">{node.host}:{node.port}</p>
        </div>
        <StatusBadge status={node.status} />
      </div>

      {!compact && (
        <>
          <div className="space-y-2">
            <UsageBar label="CPU" value={node.cpu} />
            <UsageBar label="Memory" value={node.memory} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-muted-foreground">Keys</span>
              <p className="font-mono text-foreground">{node.keys.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Hit Rate</span>
              <p className="font-mono text-ef-green">{node.hitRate}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Region</span>
              <p className="font-mono text-foreground">{node.region}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Uptime</span>
              <p className="font-mono text-foreground">{node.uptime}</p>
            </div>
          </div>

          {(node.replicaOf.length > 0 || node.replicaFor.length > 0) && (
            <div className="text-[10px] text-muted-foreground space-y-0.5 border-t border-border pt-2">
              {node.replicaOf.length > 0 && <p>Replica of: <span className="text-ef-purple">{node.replicaOf.join(', ')}</span></p>}
              {node.replicaFor.length > 0 && <p>Replica for: <span className="text-ef-purple">{node.replicaFor.join(', ')}</span></p>}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground">v{node.version}</p>
        </>
      )}
    </div>
  );
}

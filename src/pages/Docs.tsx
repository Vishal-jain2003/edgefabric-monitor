import { useState } from 'react';
import { BookOpen, FileText } from 'lucide-react';

const adrs = [
  { id: 'ADR-001', title: 'Consistent Hashing with Virtual Nodes', author: 'Engineering', date: '2024-01-15', status: 'Accepted',
    content: 'We adopt consistent hashing with 150 virtual nodes per physical node to distribute keys across the cluster.\n\n**Context:** As our distributed cache scales horizontally, we need a partitioning strategy that minimizes key redistribution when nodes join or leave. Traditional modulo hashing causes O(n) key movements.\n\n**Decision:** Use consistent hashing with virtual nodes (vnodes). Each physical node maps to 150 positions on the ring, providing uniform key distribution with only ~1/N keys needing redistribution during topology changes.\n\n**Consequences:** Key movement during rebalance is bounded to ≤10% of total keys. Lookup requires O(log N) binary search on the ring. Memory overhead for the ring metadata is negligible (~50KB per 1000 vnodes).' },
  { id: 'ADR-002', title: 'SWIM Protocol for Membership', author: 'Engineering', date: '2024-01-20', status: 'Accepted',
    content: 'We adopt the SWIM protocol for failure detection and membership management.\n\n**Context:** Traditional heartbeat protocols (all-to-all) have O(n²) message complexity, which doesn\'t scale. We need efficient, decentralized failure detection.\n\n**Decision:** Implement SWIM with configurable probe intervals. Failure detection proceeds through ALIVE → SUSPECT → FAILED states with indirect probing to reduce false positives.\n\n**Consequences:** Message complexity is O(n) per round. False positive rate is minimized through indirect probing. Convergence time is bounded by the gossip dissemination rate (~280ms for 3 nodes).' },
  { id: 'ADR-003', title: 'WAL + Snapshot Persistence Strategy', author: 'Engineering', date: '2024-02-01', status: 'Accepted',
    content: 'We use a Write-Ahead Log combined with periodic snapshots for durability.\n\n**Context:** As an in-memory cache, we need optional persistence for disaster recovery without sacrificing write performance.\n\n**Decision:** All mutations are appended to a WAL before being applied. Snapshots are taken periodically to enable fast recovery. Recovery replays the WAL from the last snapshot.\n\n**Consequences:** Write latency increases by ~0.1ms (async WAL flush). Recovery time is bounded by snapshot interval + WAL replay time. Storage usage is manageable with WAL compaction.' },
  { id: 'ADR-004', title: 'Token Bucket Rate Limiting', author: 'Engineering', date: '2024-02-10', status: 'Accepted',
    content: 'We implement token bucket rate limiting at both global and per-tenant levels.\n\n**Context:** To prevent any single tenant from overwhelming the cache cluster, we need fair request throttling.\n\n**Decision:** Token bucket algorithm with configurable burst capacity. Global limit protects the cluster, per-tenant limits ensure fairness.\n\n**Consequences:** Provides smooth rate limiting with burst support. Overhead is minimal — one atomic counter per tenant. Rejected requests return 429 with retry-after header.' },
  { id: 'ADR-005', title: 'mTLS for Intra-Cluster Security', author: 'Security', date: '2024-02-15', status: 'Proposed',
    content: 'We mandate mutual TLS for all intra-cluster communication.\n\n**Context:** Cache data transits between nodes during replication and rebalancing. This data must be encrypted in transit.\n\n**Decision:** All inter-node gRPC connections use mTLS with auto-rotating certificates. External client connections support both mTLS and token-based auth.\n\n**Consequences:** Zero-trust security posture. Certificate rotation is automated with zero downtime. ~2% throughput overhead from TLS handshakes is acceptable.' },
  { id: 'ADR-006', title: 'MCP for Agentic Operations', author: 'Engineering', date: '2024-03-01', status: 'Proposed',
    content: 'We implement the Model Context Protocol for AI-assisted cluster operations.\n\n**Context:** Operating a distributed cache requires expertise. An AI agent can observe, explain, and suggest actions while keeping humans in the loop for destructive operations.\n\n**Decision:** MCP with three tool categories: observe (read-only), explain (analysis), act (requires approval). All act commands go through human-in-the-loop approval.\n\n**Consequences:** Reduces operational burden. All actions are audited. Destructive actions (drain, remove) always require human approval. Natural language interface lowers the barrier to cluster management.' },
];

const runbooks = [
  { id: 'RB-001', title: 'Node Failure Recovery', content: '1. Identify failed node via dashboard or alerts\n2. Check gossip page for failure timeline\n3. If hardware issue: drain node, add replacement\n4. If software issue: restart node process\n5. Monitor rebalancer for key redistribution\n6. Verify hit rate recovers within 5 minutes' },
  { id: 'RB-002', title: 'Adding a New Node', content: '1. Register node via Cluster Nodes page or API\n2. Monitor rebalancer — key movement should be ≤10%\n3. Watch hit rate — temporary dip is expected\n4. Verify all nodes show HEALTHY after rebalance\n5. Run basic cache operations to confirm' },
  { id: 'RB-003', title: 'Certificate Rotation', content: '1. Navigate to Security page\n2. Click "Rotate All" or rotate individual certs\n3. Rotation uses zero-downtime strategy\n4. Verify all nodes reconnect with new certs\n5. Check that no sessions were dropped' },
  { id: 'RB-004', title: 'Emergency Cache Drain', content: '1. Go to Cluster Nodes → select problematic node\n2. Click "Drain" → keys migrate to other nodes\n3. Monitor progress on Rebalancer page\n4. Once drained, node can be safely removed\n5. Alert: do NOT remove before drain completes' },
  { id: 'RB-005', title: 'Chaos Test Playbook', content: '1. Ensure SLO monitoring is active\n2. Select chaos scenario type\n3. Start with least destructive (latency injection)\n4. Monitor SLO panel during test\n5. Document results in chaos history\n6. If SLO breached, investigate and add resilience' },
];

export default function Docs() {
  const [selected, setSelected] = useState<string>('ADR-001');

  const allDocs = [...adrs.map(a => ({ ...a, type: 'adr' })), ...runbooks.map(r => ({ ...r, type: 'runbook', author: 'Ops', date: '2024-02', status: 'Active' }))];
  const current = allDocs.find(d => d.id === selected);

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <div>
          <h4 className="font-display text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Architecture Decision Records</h4>
          {adrs.map(a => (
            <button key={a.id} onClick={() => setSelected(a.id)}
              className={`w-full text-left px-3 py-2 rounded text-[11px] mb-0.5 transition-colors ${selected === a.id ? 'bg-ef-cyan/10 text-ef-cyan border border-ef-cyan/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent'}`}>
              <span className="font-mono text-[9px] text-muted-foreground">{a.id}</span>
              <p className="truncate">{a.title}</p>
            </button>
          ))}
        </div>
        <div>
          <h4 className="font-display text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Operational Runbooks</h4>
          {runbooks.map(r => (
            <button key={r.id} onClick={() => setSelected(r.id)}
              className={`w-full text-left px-3 py-2 rounded text-[11px] mb-0.5 transition-colors ${selected === r.id ? 'bg-ef-cyan/10 text-ef-cyan border border-ef-cyan/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent'}`}>
              <span className="font-mono text-[9px] text-muted-foreground">{r.id}</span>
              <p className="truncate">{r.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 glass-card p-6">
        {current && (
          <div className="animate-fade-slide">
            <div className="flex items-center gap-3 mb-4">
              {current.type === 'adr' ? <BookOpen size={18} className="text-ef-cyan" /> : <FileText size={18} className="text-ef-green" />}
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">{current.title}</h2>
                <div className="flex gap-3 text-[10px] text-muted-foreground mt-0.5">
                  <span>{current.author}</span>
                  <span>{current.date}</span>
                  <span className={`px-1.5 py-0.5 rounded ${current.status === 'Accepted' || current.status === 'Active' ? 'bg-ef-green/10 text-ef-green' : 'bg-ef-amber/10 text-ef-amber'}`}>{current.status}</span>
                </div>
              </div>
            </div>
            <div className="text-[12px] text-foreground leading-relaxed whitespace-pre-wrap font-body">{current.content}</div>
          </div>
        )}
      </div>
    </div>
  );
}

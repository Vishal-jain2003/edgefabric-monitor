import { useState } from 'react';
import { NodeCard } from '@/components/edgefabric/NodeCard';
import { HashRingViz } from '@/components/edgefabric/HashRingViz';
import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MOCK_NODES, MOCK_NODE_TIMELINE } from '@/mock/mockData';
import { registerNode } from '@/api/cache';
import { toast } from 'sonner';

export default function ClusterNodes() {
  const [regId, setRegId] = useState('');
  const [regHost, setRegHost] = useState('');
  const [regPort, setRegPort] = useState('');

  const handleRegister = async () => {
    if (!regId || !regHost || !regPort) return;
    try {
      await registerNode(regId, regHost, parseInt(regPort));
      toast.success(`Node ${regId} registered successfully`);
      setRegId(''); setRegHost(''); setRegPort('');
    } catch {
      toast.error('Failed to register node');
    }
  };

  const inputClass = "w-full bg-muted/50 border border-border rounded-md px-3 py-2 text-[12px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ef-cyan/50";

  return (
    <div className="space-y-6">
      {/* Hash Ring */}
      <div className="glass-card p-6 flex flex-col items-center">
        <h3 className="font-display font-semibold text-sm text-foreground mb-4">Consistent Hash Ring</h3>
        <HashRingViz nodes={MOCK_NODES.map(n => ({ id: n.id, status: n.status }))} size={300} />
      </div>

      {/* Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_NODES.map(node => (
          <div key={node.id} className="relative">
            <NodeCard node={node} />
            <div className="mt-2 flex gap-2">
              {['Drain', 'Warm Up', 'Remove'].map(action => (
                <button key={action} onClick={() => toast.info(`Mock: ${action} ${node.id}`)}
                  className="flex-1 text-[10px] py-1 rounded bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Register Node */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="font-display font-semibold text-sm text-foreground">Register New Node</h3>
        <div className="p-2 rounded bg-ef-amber/5 border border-ef-amber/20 text-[11px] text-ef-amber">
          ⚠ Registering a node triggers rebalancing
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} placeholder="Cache Node ID" value={regId} onChange={e => setRegId(e.target.value)} />
          <input className={inputClass} placeholder="Host" value={regHost} onChange={e => setRegHost(e.target.value)} />
          <input className={inputClass} placeholder="Port" value={regPort} onChange={e => setRegPort(e.target.value)} />
        </div>
        <button onClick={handleRegister} className="px-4 py-2 rounded-md bg-ef-cyan/10 border border-ef-cyan/30 text-ef-cyan text-[12px] font-medium hover:bg-ef-cyan/20 transition-colors">
          Register Node
        </button>
      </div>

      {/* Node Timeline */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-sm text-foreground">Node Timeline</h3>
          <SimulatedBadge />
        </div>
        <div className="space-y-2">
          {MOCK_NODE_TIMELINE.map((evt, i) => (
            <div key={i} className="flex items-start gap-3 text-[11px] py-1.5 border-b border-border/50">
              <span className="text-muted-foreground font-mono w-20 flex-shrink-0">{evt.time}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                evt.event.includes('JOIN') || evt.event.includes('DONE') || evt.event.includes('RECOVER') ? 'text-ef-green bg-ef-green/10' :
                evt.event.includes('SUSPECT') ? 'text-ef-amber bg-ef-amber/10' :
                'text-ef-blue bg-ef-blue/10'
              }`}>{evt.event}</span>
              <span className="text-ef-cyan font-mono">{evt.node}</span>
              <span className="text-muted-foreground">{evt.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { MOCK_WAL, MOCK_WAL_ENTRIES, MOCK_SNAPSHOTS } from '@/mock/mockData';
import { toast } from 'sonner';

export default function Persistence() {
  const [recovering, setRecovering] = useState(false);
  const [recoveryProgress, setRecoveryProgress] = useState(0);

  const simulateRecovery = () => {
    setRecovering(true);
    setRecoveryProgress(0);
    const id = setInterval(() => {
      setRecoveryProgress(p => {
        if (p >= 100) { clearInterval(id); setRecovering(false); toast.success('Recovery complete! 825,870 keys restored in 3.2s'); return 100; }
        return p + 2;
      });
    }, 60);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">WAL & Snapshots</h3>
        <SimulatedBadge sprint={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WAL */}
        <div className="glass-card p-5 space-y-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground">Write-Ahead Log</h4>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="WAL Entries" value={MOCK_WAL.entries.toLocaleString()} color="cyan" />
            <MetricCard label="WAL Size" value={`${MOCK_WAL.walSizeMb} MB`} color="blue" />
          </div>
          <div className="text-[11px] space-y-1 text-muted-foreground">
            <p>Last flush: <span className="text-foreground font-mono">{MOCK_WAL.lastFlush}</span></p>
            <p>Flush interval: <span className="text-foreground font-mono">100ms</span></p>
            <p>Status: <span className="text-ef-green font-mono">ACTIVE</span></p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead><tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-1 px-1">Seq</th><th className="text-left py-1 px-1">Op</th><th className="text-left py-1 px-1">Key</th><th className="text-left py-1 px-1">Tenant</th><th className="text-right py-1 px-1">Size</th>
              </tr></thead>
              <tbody>
                {MOCK_WAL_ENTRIES.map(e => (
                  <tr key={e.seq} className="border-b border-border/30">
                    <td className="py-1 px-1 font-mono text-muted-foreground">{e.seq}</td>
                    <td className="py-1 px-1"><span className={e.op === 'PUT' ? 'text-ef-blue' : 'text-ef-red'}>{e.op}</span></td>
                    <td className="py-1 px-1 font-mono text-foreground">{e.key}</td>
                    <td className="py-1 px-1 text-muted-foreground">{e.tenant}</td>
                    <td className="py-1 px-1 text-right font-mono">{e.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => toast.info('Mock: WAL flushed')} className="text-[10px] px-3 py-1 rounded bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors">Force Flush</button>
        </div>

        {/* Snapshots */}
        <div className="glass-card p-5 space-y-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground">Snapshots</h4>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Last Snapshot" value={MOCK_WAL.lastSnapshot} color="cyan" />
            <MetricCard label="Size" value={`${MOCK_WAL.snapshotSizeMb} MB`} color="blue" />
          </div>
          <div className="text-[11px] text-muted-foreground">
            <p>Recovery estimate: <span className="text-foreground font-mono">{MOCK_WAL.recoveryTimeEstimateSec}s</span></p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead><tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-1 px-1">ID</th><th className="text-left py-1 px-1">Time</th><th className="text-left py-1 px-1">Size</th><th className="text-left py-1 px-1">Keys</th><th className="text-left py-1 px-1">Status</th>
              </tr></thead>
              <tbody>
                {MOCK_SNAPSHOTS.map(s => (
                  <tr key={s.id} className="border-b border-border/30">
                    <td className="py-1 px-1 font-mono text-ef-cyan">{s.id}</td>
                    <td className="py-1 px-1 text-muted-foreground">{s.timestamp}</td>
                    <td className="py-1 px-1 font-mono">{s.size}</td>
                    <td className="py-1 px-1 font-mono">{s.keys.toLocaleString()}</td>
                    <td className="py-1 px-1 text-ef-green">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => toast.info('Mock: Snapshot taken')} className="text-[10px] px-3 py-1 rounded bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors">Take Snapshot Now</button>
        </div>
      </div>

      {/* Recovery Simulator */}
      <div className="glass-card p-5 space-y-4">
        <h4 className="font-display text-[12px] font-semibold text-foreground">Recovery Simulator</h4>
        {!recovering ? (
          <button onClick={simulateRecovery} className="px-4 py-2 rounded bg-ef-amber/10 border border-ef-amber/30 text-ef-amber text-[12px] hover:bg-ef-amber/20 transition-colors">
            Simulate Crash + Recovery
          </button>
        ) : (
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-100" style={{ width: `${recoveryProgress}%`, background: recoveryProgress < 60 ? '#448AFF' : recoveryProgress < 95 ? '#FFB300' : '#00E676' }} />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              {recoveryProgress < 60 ? 'Loading snapshot...' : recoveryProgress < 95 ? 'Replaying WAL entries...' : 'Recovery complete!'} {recoveryProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

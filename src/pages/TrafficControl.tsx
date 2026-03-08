import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { MOCK_RATE_LIMITER, MOCK_CIRCUIT_BREAKER } from '@/mock/mockData';
import { toast } from 'sonner';

export default function TrafficControl() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">Traffic Control</h3>
        <SimulatedBadge sprint={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rate Limiter */}
        <div className="glass-card p-5 space-y-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground">Rate Limiter</h4>
          <div className="text-[11px] text-muted-foreground space-y-1">
            <p>Algorithm: <span className="text-foreground font-mono">{MOCK_RATE_LIMITER.algorithm}</span></p>
            <p>Global Limit: <span className="text-foreground font-mono">{MOCK_RATE_LIMITER.globalRps.toLocaleString()} rps</span></p>
            <p>Current: <span className="text-ef-cyan font-mono">{MOCK_RATE_LIMITER.currentRps.toLocaleString()} rps</span></p>
            <p>Rejected: <span className="text-ef-green font-mono">{MOCK_RATE_LIMITER.rejectedLastMin}</span></p>
          </div>
          {/* Usage gauge */}
          <div className="space-y-1">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-ef-cyan rounded-full transition-all" style={{ width: `${(MOCK_RATE_LIMITER.currentRps / MOCK_RATE_LIMITER.globalRps) * 100}%` }} />
            </div>
            <p className="text-[9px] text-muted-foreground">{((MOCK_RATE_LIMITER.currentRps / MOCK_RATE_LIMITER.globalRps) * 100).toFixed(1)}% capacity</p>
          </div>
          {/* Tenant table */}
          <table className="w-full text-[10px]">
            <thead><tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-1">Tenant</th><th className="text-right py-1">Limit</th><th className="text-right py-1">Current</th><th className="text-right py-1">Usage</th>
            </tr></thead>
            <tbody>
              {MOCK_RATE_LIMITER.tenants.map(t => (
                <tr key={t.name} className="border-b border-border/30">
                  <td className="py-1 font-mono text-foreground">{t.name}</td>
                  <td className="py-1 text-right font-mono text-muted-foreground">{t.limit.toLocaleString()}</td>
                  <td className="py-1 text-right font-mono text-ef-cyan">{t.current.toLocaleString()}</td>
                  <td className="py-1 text-right font-mono text-ef-green">{((t.current / t.limit) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Circuit Breaker */}
        <div className="glass-card p-5 space-y-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground">Circuit Breaker</h4>
          <div className="flex items-center justify-center py-4">
            <div className={`w-24 h-24 rounded-full border-3 flex flex-col items-center justify-center ${
              MOCK_CIRCUIT_BREAKER.status === 'CLOSED' ? 'border-ef-green bg-ef-green/10 text-ef-green' :
              MOCK_CIRCUIT_BREAKER.status === 'OPEN' ? 'border-ef-red bg-ef-red/10 text-ef-red' :
              'border-ef-amber bg-ef-amber/10 text-ef-amber'
            }`}>
              <span className="font-mono text-sm font-bold">{MOCK_CIRCUIT_BREAKER.status}</span>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground space-y-1">
            <p>Success Rate: <span className="text-ef-green font-mono">{MOCK_CIRCUIT_BREAKER.successRate}%</span></p>
            <p>Timeout Rate: <span className="text-ef-amber font-mono">{MOCK_CIRCUIT_BREAKER.timeoutRate}%</span></p>
            <p>Open Count: <span className="text-foreground font-mono">{MOCK_CIRCUIT_BREAKER.openCount}</span></p>
            <p>Last Opened: <span className="text-foreground font-mono">{MOCK_CIRCUIT_BREAKER.lastOpened}</span></p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground">
            <span className="text-ef-green">CLOSED</span> ↔ <span className="text-ef-red">OPEN</span> ↔ <span className="text-ef-amber">HALF-OPEN</span>
          </div>
          <button onClick={() => toast.info('Mock: Circuit breaker tripped')} className="w-full text-[10px] py-1 rounded bg-ef-red/10 border border-ef-red/30 text-ef-red hover:bg-ef-red/20 transition-colors">
            Manually Trip
          </button>
        </div>

        {/* Load Balancer Config */}
        <div className="glass-card p-5 space-y-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground">Load Balancer Config</h4>
          <div className="space-y-3 text-[11px]">
            {[
              { label: 'Health Check', value: 'TCP' },
              { label: 'Timeout', value: '5000ms' },
              { label: 'Retry Attempts', value: '3' },
              { label: 'Slow-Start', value: '30s' },
              { label: 'Outlier Detection', value: 'Enabled' },
            ].map(c => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{c.label}</span>
                <span className="font-mono text-foreground bg-muted/50 px-2 py-0.5 rounded">{c.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => toast.info('Mock: Config applied')} className="w-full text-[10px] py-1 rounded bg-ef-cyan/10 border border-ef-cyan/30 text-ef-cyan hover:bg-ef-cyan/20 transition-colors">
            Apply Config
          </button>
        </div>
      </div>
    </div>
  );
}

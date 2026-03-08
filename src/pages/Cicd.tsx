import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { MOCK_CICD, MOCK_DEPLOYMENT_HISTORY } from '@/mock/mockData';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const pipelineStages = [
  { name: 'Commit', status: 'pass', duration: '0s' },
  { name: 'Unit Tests', status: 'pass', duration: '42s' },
  { name: 'Integration', status: 'warn', duration: '1m 12s' },
  { name: 'Chaos Tests', status: 'warn', duration: '3m 05s' },
  { name: 'Coverage Gate', status: 'pass', duration: '2s' },
  { name: 'Deploy', status: 'pass', duration: '2m 34s' },
];

export default function Cicd() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">CI/CD Pipeline</h3>
        <SimulatedBadge sprint={6} />
      </div>

      {/* Build status */}
      <div className="glass-card p-4 flex items-center gap-4">
        <CheckCircle className="text-ef-green" size={24} />
        <div>
          <p className="font-display font-semibold text-sm text-foreground">Build <span className="text-ef-green">PASSING</span></p>
          <p className="text-[10px] text-muted-foreground font-mono">Branch: {MOCK_CICD.branch} · {MOCK_CICD.lastBuild}</p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="glass-card p-5">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-4">Pipeline</h4>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {pipelineStages.map((stage, i) => (
            <div key={stage.name} className="flex items-center gap-1">
              <div className={`px-3 py-2 rounded border text-[10px] text-center min-w-[90px] ${
                stage.status === 'pass' ? 'border-ef-green/30 bg-ef-green/5 text-ef-green' :
                stage.status === 'warn' ? 'border-ef-amber/30 bg-ef-amber/5 text-ef-amber' :
                'border-ef-red/30 bg-ef-red/5 text-ef-red'
              }`}>
                <p className="font-medium">{stage.name}</p>
                <p className="font-mono text-[9px] mt-0.5">{stage.duration}</p>
              </div>
              {i < pipelineStages.length - 1 && <span className="text-muted-foreground text-[10px]">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Test results */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Unit Tests', data: MOCK_CICD.unitTests, color: 'green' as const },
          { label: 'Integration Tests', data: MOCK_CICD.integrationTests, color: MOCK_CICD.integrationTests.failed > 0 ? 'amber' as const : 'green' as const },
          { label: 'Chaos Tests', data: MOCK_CICD.chaosTests, color: MOCK_CICD.chaosTests.failed > 0 ? 'amber' as const : 'green' as const },
        ].map(t => (
          <div key={t.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              {t.data.failed === 0 ? <CheckCircle size={14} className="text-ef-green" /> : <AlertTriangle size={14} className="text-ef-amber" />}
              <h4 className="text-[11px] font-display font-semibold text-foreground">{t.label}</h4>
            </div>
            <p className="font-mono text-lg text-foreground">{t.data.passed}<span className="text-muted-foreground text-sm">/{t.data.total}</span></p>
            {t.data.failed > 0 && <p className="text-[10px] text-ef-amber mt-1">{t.data.failed} failing</p>}
          </div>
        ))}
      </div>

      {/* Coverage */}
      <div className="glass-card p-4">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-3">Code Coverage</h4>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(215 20% 15%)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#00E676" strokeWidth="3" strokeDasharray={`${MOCK_CICD.coverage}, 100`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-ef-green">{MOCK_CICD.coverage}%</span>
          </div>
          <div className="text-[10px] text-muted-foreground space-y-1">
            <p>Target: ≥80% <span className="text-ef-green">✓</span></p>
            <p>Load Balancer: <span className="font-mono text-foreground">89%</span></p>
            <p>Cache Node: <span className="font-mono text-foreground">82%</span></p>
            <p>Registry: <span className="font-mono text-foreground">91%</span></p>
            <p>HashRing: <span className="font-mono text-foreground">96%</span></p>
          </div>
        </div>
      </div>

      {/* Deployment History */}
      <div className="glass-card p-5">
        <h4 className="font-display text-[12px] font-semibold text-foreground mb-3">Deployment History</h4>
        <table className="w-full text-[10px]">
          <thead><tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-1.5 px-2">Version</th>
            <th className="text-left py-1.5 px-2">Time</th>
            <th className="text-left py-1.5 px-2">Duration</th>
            <th className="text-left py-1.5 px-2">Strategy</th>
            <th className="text-left py-1.5 px-2">Status</th>
          </tr></thead>
          <tbody>
            {MOCK_DEPLOYMENT_HISTORY.map(d => (
              <tr key={d.version} className="border-b border-border/30">
                <td className="py-1.5 px-2 font-mono text-ef-cyan">{d.version}</td>
                <td className="py-1.5 px-2 text-muted-foreground">{d.time}</td>
                <td className="py-1.5 px-2 font-mono">{d.duration}</td>
                <td className="py-1.5 px-2">{d.strategy}</td>
                <td className="py-1.5 px-2">
                  <span className={d.status === 'DEPLOYED' ? 'text-ef-green' : 'text-ef-red'}>{d.status === 'DEPLOYED' ? '✓' : '✗'} {d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

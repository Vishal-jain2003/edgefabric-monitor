import { MetricCard } from '@/components/edgefabric/MetricCard';
import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MOCK_METRICS, MOCK_HIT_RATE_HISTORY, MOCK_LATENCY_HISTORY, MOCK_THROUGHPUT_HISTORY } from '@/mock/mockData';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckCircle } from 'lucide-react';

const tooltipStyle = { background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, fontFamily: 'JetBrains Mono' };

export default function Metrics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">Metrics Dashboard</h3>
        <SimulatedBadge sprint={3} />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MetricCard label="Hit Rate" value={`${MOCK_METRICS.hitRate}%`} color="green" />
        <MetricCard label="Miss Rate" value={`${MOCK_METRICS.missRate}%`} color="amber" />
        <MetricCard label="Total Ops" value={MOCK_METRICS.totalOps.toLocaleString()} color="cyan" />
        <MetricCard label="Evictions" value={MOCK_METRICS.evictions} color="red" />
        <MetricCard label="P50 Latency" value={`${MOCK_METRICS.p50Latency}ms`} color="cyan" />
        <MetricCard label="P95 Latency" value={`${MOCK_METRICS.p95Latency}ms`} color="amber" />
        <MetricCard label="Throughput" value={`${MOCK_METRICS.throughputRps}`} unit="rps" color="blue" />
        <MetricCard label="Availability" value={`${MOCK_METRICS.availability}%`} color="green" />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground mb-3">Hit Rate (24h)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_HIT_RATE_HISTORY}>
              <defs><linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00E676" stopOpacity={0.3} /><stop offset="95%" stopColor="#00E676" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#8899AA' }} /><YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#8899AA' }} />
              <Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="rate" stroke="#00E676" fill="url(#hrGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground mb-3">Latency P50/P95/P99 (30m)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_LATENCY_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8899AA' }} /><YAxis tick={{ fontSize: 10, fill: '#8899AA' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="p50" stroke="#00E5FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p95" stroke="#FFB300" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p99" stroke="#FF1744" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground mb-3">Throughput (30m)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_THROUGHPUT_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8899AA' }} /><YAxis tick={{ fontSize: 10, fill: '#8899AA' }} />
              <Tooltip contentStyle={tooltipStyle} /><Bar dataKey="rps" fill="#448AFF" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SLO Status */}
        <div className="glass-card p-4 space-y-4">
          <h4 className="font-display text-[12px] font-semibold text-foreground">SLO Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded bg-ef-green/5 border border-ef-green/20">
              <div>
                <p className="text-[11px] text-muted-foreground">Availability SLO: ≥ 99.5%</p>
                <p className="font-mono text-lg text-ef-green">{MOCK_METRICS.availability}%</p>
              </div>
              <CheckCircle className="text-ef-green" size={20} />
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-ef-green/5 border border-ef-green/20">
              <div>
                <p className="text-[11px] text-muted-foreground">GET P95 SLO: ≤ 10ms</p>
                <p className="font-mono text-lg text-ef-green">{MOCK_METRICS.p95Latency}ms</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">* Measured intra-AZ. Cross-region adds ~240ms.</p>
              </div>
              <CheckCircle className="text-ef-green" size={20} />
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => {
        const blob = new Blob([JSON.stringify(MOCK_METRICS, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'edgefabric-metrics.json'; a.click();
      }} className="text-[11px] px-3 py-1.5 rounded bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors">
        Export as JSON
      </button>
    </div>
  );
}

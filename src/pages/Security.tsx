import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MetricCard } from '@/components/edgefabric/MetricCard';
import { MOCK_SECURITY } from '@/mock/mockData';
import { toast } from 'sonner';
import { CheckCircle, Shield } from 'lucide-react';

const certs = [
  { name: 'Load Balancer', expiry: '89 days', status: 'VALID' },
  { name: 'Node-1', expiry: '89 days', status: 'VALID' },
  { name: 'Node-2', expiry: '89 days', status: 'VALID' },
  { name: 'Node-3', expiry: '42 days', status: 'VALID' },
  { name: 'Registry', expiry: '89 days', status: 'VALID' },
];

export default function Security() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">Security</h3>
        <SimulatedBadge sprint={6} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard label="mTLS" value={MOCK_SECURITY.mtlsEnabled ? 'ENABLED' : 'DISABLED'} color={MOCK_SECURITY.mtlsEnabled ? 'green' : 'red'} />
        <MetricCard label="Auth Mode" value={MOCK_SECURITY.authMode} color="blue" />
        <MetricCard label="Cert Expiry" value={MOCK_SECURITY.certExpiry} color="green" />
        <MetricCard label="Last Rotation" value={MOCK_SECURITY.lastRotation} color="cyan" />
        <MetricCard label="Sessions" value={MOCK_SECURITY.activeSessions} color="cyan" />
      </div>

      {/* Certificates */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-[12px] font-semibold text-foreground">Certificate Management</h4>
          <button onClick={() => toast.info('Mock: All certificates rotated')} className="text-[10px] px-3 py-1 rounded bg-ef-green/10 border border-ef-green/30 text-ef-green hover:bg-ef-green/20 transition-colors">Rotate All</button>
        </div>
        <table className="w-full text-[10px]">
          <thead><tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-1.5 px-2">Certificate</th>
            <th className="text-left py-1.5 px-2">Expiry</th>
            <th className="text-left py-1.5 px-2">Status</th>
            <th className="text-right py-1.5 px-2">Action</th>
          </tr></thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.name} className="border-b border-border/30">
                <td className="py-1.5 px-2 font-mono text-foreground flex items-center gap-1.5"><Shield size={12} className="text-ef-blue" /> {c.name}</td>
                <td className="py-1.5 px-2 font-mono text-muted-foreground">{c.expiry}</td>
                <td className="py-1.5 px-2"><span className="text-ef-green flex items-center gap-1"><CheckCircle size={10} /> {c.status}</span></td>
                <td className="py-1.5 px-2 text-right">
                  <button onClick={() => toast.info(`Mock: ${c.name} cert rotated`)} className="text-ef-cyan hover:underline">Rotate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

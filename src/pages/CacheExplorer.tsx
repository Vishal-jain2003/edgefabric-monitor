import { useState } from 'react';
import { putCache, getCache } from '@/api/cache';
import { useOperations } from '@/context/OperationsContext';
import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { FLAGS } from '@/config/flags';
import { Upload, Download, Trash2, Code } from 'lucide-react';
import { toast } from 'sonner';

const CONTENT_TYPES = [
  'application/json', 'text/plain', 'text/html', 'text/csv',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'application/xml', 'application/octet-stream',
];

const TTL_OPTIONS = [
  { label: '1s', value: 1000 }, { label: '5s', value: 5000 }, { label: '30s', value: 30000 },
  { label: '1min', value: 60000 }, { label: '5min', value: 300000 }, { label: '30min', value: 1800000 },
  { label: '1h', value: 3600000 }, { label: '6h', value: 21600000 }, { label: '24h', value: 86400000 },
];

const QUICK_SCENARIOS = [
  { label: '🧑 User Profile', key: 'user:1042', value: '{"name":"Alice","email":"alice@edge.io","plan":"pro"}', tenant: 'edgefabric', ttl: 3600000, ct: 'application/json' },
  { label: '🔑 Session Token', key: 'session:abc123', value: '{"token":"eyJhbGci...","exp":1699999999}', tenant: 'edgefabric', ttl: 1800000, ct: 'application/json' },
  { label: '📦 Product', key: 'product:SKU-99', value: '{"name":"Edge Router","price":299.99,"stock":142}', tenant: 'store', ttl: 300000, ct: 'application/json' },
  { label: '🚩 Feature Flag', key: 'flag:dark-mode', value: '{"enabled":true,"rollout":0.5}', tenant: 'platform', ttl: 60000, ct: 'application/json' },
  { label: '🌤 API Response', key: 'api:weather:nyc', value: '{"temp":72,"condition":"sunny","wind":8}', tenant: 'edgefabric', ttl: 300000, ct: 'application/json' },
];

export default function CacheExplorer() {
  // PUT state
  const [putKey, setPutKey] = useState('');
  const [putValue, setPutValue] = useState('');
  const [putTenant, setPutTenant] = useState('default');
  const [putTtl, setPutTtl] = useState(3600000);
  const [putCt, setPutCt] = useState('application/json');
  const [putResult, setPutResult] = useState<any>(null);
  const [putting, setPutting] = useState(false);

  // GET state
  const [getKey, setGetKey] = useState('');
  const [getTenant, setGetTenant] = useState('default');
  const [getResult, setGetResult] = useState<any>(null);
  const [getting, setGetting] = useState(false);

  // DELETE state
  const [delKey, setDelKey] = useState('');
  const [delTenant, setDelTenant] = useState('default');

  const { addOperation } = useOperations();

  const handlePut = async () => {
    if (!putKey) return;
    setPutting(true);
    setPutResult(null);
    try {
      const res = await putCache(putKey, putValue, putTenant, putTtl, putCt);
      setPutResult({ success: true, latency: res.latency, source: res.source });
      addOperation({ method: 'PUT', key: putKey, tenant: putTenant, result: 'OK', latency: res.latency });
      toast.success(`Stored "${putKey}" successfully (${res.latency}ms)`);
    } catch (e: any) {
      setPutResult({ success: false, error: e.message, latency: e.latency });
      addOperation({ method: 'PUT', key: putKey, tenant: putTenant, result: 'ERROR', latency: e.latency || 0 });
      toast.error(`Failed to store "${putKey}": ${e.message}`);
    }
    setPutting(false);
  };

  const handleGet = async () => {
    if (!getKey) return;
    setGetting(true);
    setGetResult(null);
    try {
      const res = await getCache(getKey, getTenant);
      if (res.hit && res.data) {
        const blob = res.data as Blob;
        let display: any = null;
        if (res.contentType.includes('json') || res.contentType.includes('text')) {
          display = { type: 'text', content: await blob.text() };
        } else if (res.contentType.startsWith('image/')) {
          display = { type: 'image', url: URL.createObjectURL(blob) };
        } else {
          display = { type: 'binary', size: blob.size };
        }
        setGetResult({ hit: true, display, latency: res.latency, contentType: res.contentType, size: blob.size });
        addOperation({ method: 'GET', key: getKey, tenant: getTenant, result: 'HIT', latency: res.latency });
      } else {
        setGetResult({ hit: false, latency: res.latency });
        addOperation({ method: 'GET', key: getKey, tenant: getTenant, result: 'MISS', latency: res.latency });
      }
    } catch (e: any) {
      setGetResult({ hit: false, error: e.message, latency: e.latency });
      addOperation({ method: 'GET', key: getKey, tenant: getTenant, result: 'ERROR', latency: e.latency || 0 });
    }
    setGetting(false);
  };

  const inputClass = "w-full bg-muted/50 border border-border rounded-md px-3 py-2 text-[12px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ef-cyan/50";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PUT Panel */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Upload size={16} className="text-ef-blue" />
            <h3 className="font-display font-semibold text-sm text-foreground">PUT (Store)</h3>
          </div>

          <input className={inputClass} placeholder="Key (e.g., user:1042)" value={putKey} onChange={e => setPutKey(e.target.value)} />
          
          <textarea className={`${inputClass} h-24 resize-none`} placeholder="Value (JSON or text)" value={putValue} onChange={e => setPutValue(e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Content-Type</label>
              <select className={inputClass} value={putCt} onChange={e => setPutCt(e.target.value)}>
                {CONTENT_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Tenant</label>
              <input className={inputClass} value={putTenant} onChange={e => setPutTenant(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">TTL: {TTL_OPTIONS.find(t => t.value === putTtl)?.label}</label>
            <input type="range" min={0} max={TTL_OPTIONS.length - 1} value={TTL_OPTIONS.findIndex(t => t.value === putTtl)} onChange={e => setPutTtl(TTL_OPTIONS[+e.target.value].value)} className="w-full accent-ef-cyan" />
          </div>

          {/* Quick scenarios */}
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1.5">Quick Scenarios</label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SCENARIOS.map(s => (
                <button key={s.key} onClick={() => { setPutKey(s.key); setPutValue(s.value); setPutTenant(s.tenant); setPutTtl(s.ttl); setPutCt(s.ct); }}
                  className="text-[10px] px-2 py-1 rounded bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border">
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handlePut} disabled={putting || !putKey}
            className="w-full py-2 rounded-md bg-ef-cyan/10 border border-ef-cyan/30 text-ef-cyan text-[12px] font-medium hover:bg-ef-cyan/20 disabled:opacity-40 transition-colors">
            {putting ? 'Storing...' : 'STORE'}
          </button>

          {putResult && (
            <div className={`p-3 rounded-md border text-[11px] font-mono ${putResult.success ? 'border-ef-green/30 bg-ef-green/5 text-ef-green' : 'border-ef-red/30 bg-ef-red/5 text-ef-red'}`}>
              {putResult.success ? (
                <div className="space-y-0.5">
                  <p>✓ Stored successfully</p>
                  <p className="text-muted-foreground">Key: {putKey} · Tenant: {putTenant} · Latency: {putResult.latency}ms</p>
                </div>
              ) : (
                <p>✗ Error: {putResult.error}</p>
              )}
            </div>
          )}
        </div>

        {/* GET Panel */}
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Download size={16} className="text-ef-green" />
              <h3 className="font-display font-semibold text-sm text-foreground">GET (Retrieve)</h3>
            </div>

            <input className={inputClass} placeholder="Key" value={getKey} onChange={e => setGetKey(e.target.value)} />
            
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Tenant</label>
              <input className={inputClass} value={getTenant} onChange={e => setGetTenant(e.target.value)} />
            </div>

            <button onClick={handleGet} disabled={getting || !getKey}
              className="w-full py-2 rounded-md bg-ef-green/10 border border-ef-green/30 text-ef-green text-[12px] font-medium hover:bg-ef-green/20 disabled:opacity-40 transition-colors">
              {getting ? 'Fetching...' : 'GET'}
            </button>

            {getResult && (
              <div className={`p-3 rounded-md border text-[11px] font-mono ${getResult.hit ? 'border-ef-green/30 bg-ef-green/5' : getResult.error ? 'border-ef-red/30 bg-ef-red/5' : 'border-ef-amber/30 bg-ef-amber/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={getResult.hit ? 'text-ef-green' : getResult.error ? 'text-ef-red' : 'text-ef-amber'}>
                    {getResult.hit ? '● HIT' : getResult.error ? '● ERROR' : '● MISS'}
                  </span>
                  <span className="text-muted-foreground">· {getResult.latency}ms</span>
                </div>
                {getResult.hit && getResult.display && (
                  <div className="mt-2">
                    {getResult.display.type === 'text' && (
                      <pre className="text-[10px] text-foreground bg-muted/30 p-2 rounded overflow-x-auto max-h-48">{getResult.display.content}</pre>
                    )}
                    {getResult.display.type === 'image' && (
                      <img src={getResult.display.url} alt="cached" className="max-w-full max-h-48 rounded" />
                    )}
                    {getResult.display.type === 'binary' && (
                      <p className="text-muted-foreground">Binary data · {getResult.display.size} bytes</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DELETE Panel */}
          <div className="glass-card p-5 space-y-4 opacity-60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 size={16} className="text-ef-red" />
                <h3 className="font-display font-semibold text-sm text-foreground">DELETE</h3>
              </div>
              <SimulatedBadge sprint={3} />
            </div>
            <input className={inputClass} placeholder="Key" value={delKey} onChange={e => setDelKey(e.target.value)} />
            <input className={inputClass} placeholder="Tenant" value={delTenant} onChange={e => setDelTenant(e.target.value)} />
            <button onClick={() => { toast.success('Mock: Key deleted successfully'); }}
              className="w-full py-2 rounded-md bg-ef-red/10 border border-ef-red/30 text-ef-red text-[12px] font-medium hover:bg-ef-red/20 transition-colors">
              DELETE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

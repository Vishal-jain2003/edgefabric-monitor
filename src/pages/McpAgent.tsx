import { useState } from 'react';
import { SimulatedBadge } from '@/components/edgefabric/SimulatedBadge';
import { MOCK_MCP_ACTIONS } from '@/mock/mockData';
import { toast } from 'sonner';

const mcpResponses: Record<string, string> = {
  'show cluster health': '3 nodes online. node-1: HEALTHY (CPU 18%, Mem 42%), node-2: HEALTHY (CPU 22%, Mem 38%), node-3: SUSPECT (CPU 71%, Mem 89%). Recommendation: Consider draining node-3.',
  'why is node-3 suspect': 'node-3 shows elevated resource usage — CPU at 71%, memory at 89%. This exceeds the 70% CPU threshold. Recent gossip rounds show intermittent heartbeat delays. The node may be experiencing memory pressure from a large working set.',
  'suggest rebalance': 'Recommendation: Drain node-3 (269,100 keys) and add a replacement node in us-east-1c. Estimated key movement: 8.3%. Estimated time: ~4 minutes. This will reduce cluster load and improve overall latency.',
};

export default function McpAgent() {
  const [messages, setMessages] = useState(MOCK_MCP_ACTIONS);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const query = input.toLowerCase();
    setMessages(prev => [...prev, { id: Date.now(), tool: 'user', query: input, response: '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'USER' }]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const responseText = Object.entries(mcpResponses).find(([k]) => query.includes(k))?.[1] || 'Analyzing cluster state... All systems nominal. 3 nodes active, 825,870 keys distributed. No anomalies detected beyond node-3 elevated CPU usage.';
      setMessages(prev => [...prev, {
        id: Date.now() + 1, tool: 'observe', query: '', response: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'COMPLETE',
      }]);
      setThinking(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground">MCP Agent</h3>
        <SimulatedBadge sprint={6} />
      </div>

      {/* Tool status */}
      <div className="flex gap-2">
        {['observe ✓', 'explain ✓', 'act — requires approval'].map(t => (
          <span key={t} className={`text-[10px] px-2 py-1 rounded-full border ${t.includes('approval') ? 'border-ef-amber/30 text-ef-amber' : 'border-ef-green/30 text-ef-green'}`}>{t}</span>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 flex-wrap">
        {['📊 Show cluster health', '🔍 Why is node-3 suspect', '⚖️ Suggest rebalance', '🚨 Check SLO breaches'].map(q => (
          <button key={q} onClick={() => { setInput(q.replace(/^[^\s]+ /, '')); }}
            className="text-[10px] px-2 py-1 rounded bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors">
            {q}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className="glass-card p-4 min-h-[400px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 font-mono text-[11px]">
          {messages.map(msg => (
            <div key={msg.id} className={`${msg.status === 'USER' || msg.tool === 'user' ? 'text-ef-cyan' : ''}`}>
              {(msg.status === 'USER' || msg.tool === 'user') ? (
                <div><span className="text-ef-cyan font-bold">USER:</span> {msg.query}</div>
              ) : (
                <div className="space-y-1">
                  {msg.query && <div><span className="text-ef-cyan font-bold">USER:</span> {msg.query}</div>}
                  <div>
                    <span className="text-ef-green font-bold">AGENT</span>
                    <span className="text-muted-foreground"> [tool={msg.tool}]</span>
                    <span className="text-muted-foreground ml-2 text-[9px]">{msg.time}</span>
                  </div>
                  <div className="text-foreground pl-2 border-l-2 border-ef-green/30 ml-1">{msg.response}</div>
                  {msg.status === 'AWAITING_APPROVAL' && (
                    <div className="flex gap-2 mt-2 ml-3">
                      <button onClick={() => toast.success('Mock: Action approved')} className="text-[10px] px-3 py-1 rounded bg-ef-green/10 border border-ef-green/30 text-ef-green hover:bg-ef-green/20">Approve Action</button>
                      <button onClick={() => toast.info('Action rejected')} className="text-[10px] px-3 py-1 rounded bg-ef-red/10 border border-ef-red/30 text-ef-red hover:bg-ef-red/20">Reject</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="text-muted-foreground animate-pulse-glow">AGENT: Analyzing cluster state...</div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask the agent about your cluster..."
            className="flex-1 bg-muted/50 border border-border rounded px-3 py-2 text-[11px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ef-cyan/50" />
          <button onClick={handleSend} disabled={thinking}
            className="px-4 py-2 rounded bg-ef-cyan/10 border border-ef-cyan/30 text-ef-cyan text-[11px] hover:bg-ef-cyan/20 disabled:opacity-40 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

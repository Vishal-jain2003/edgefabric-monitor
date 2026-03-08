export const MOCK_METRICS = {
  hitRate: 94.2,
  missRate: 5.8,
  totalOps: 1284930,
  evictions: 342,
  rebalanceEvents: 2,
  p50Latency: 1.2,
  p95Latency: 4.8,
  p99Latency: 9.1,
  availability: 99.87,
  throughputRps: 2840,
  networkInMbps: 12.4,
  networkOutMbps: 11.9,
};

export const MOCK_NODES = [
  {
    id: "node-1", host: "10.0.1.10", port: 8081, status: "HEALTHY",
    cpu: 18, memory: 42, keys: 284930, hitRate: 96.1,
    replicaOf: [] as string[], replicaFor: ["node-2"],
    uptime: "6d 14h", region: "us-east-1a", version: "2.1.0",
  },
  {
    id: "node-2", host: "10.0.1.11", port: 8082, status: "HEALTHY",
    cpu: 22, memory: 38, keys: 271840, hitRate: 93.4,
    replicaOf: ["node-1"], replicaFor: ["node-3"],
    uptime: "6d 14h", region: "us-east-1b", version: "2.1.0",
  },
  {
    id: "node-3", host: "10.0.1.12", port: 8083, status: "SUSPECT",
    cpu: 71, memory: 89, keys: 269100, hitRate: 91.2,
    replicaOf: ["node-2"], replicaFor: [] as string[],
    uptime: "2d 3h", region: "us-east-1c", version: "2.1.0",
  },
];

export const MOCK_LATENCY_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  time: `${29 - i}m`,
  p50: +(1 + Math.random() * 2).toFixed(1),
  p95: +(4 + Math.random() * 3).toFixed(1),
  p99: +(7 + Math.random() * 4).toFixed(1),
}));

export const MOCK_HIT_RATE_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${23 - i}h`,
  rate: +(88 + Math.random() * 10).toFixed(1),
})).reverse();

export const MOCK_THROUGHPUT_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  time: `${i}m`,
  rps: +(2000 + Math.random() * 1500).toFixed(0),
}));

export const MOCK_REPLICATION = {
  factor: 2,
  syncLag: 12,
  pendingRepairs: 3,
  lastAntiEntropy: "4 minutes ago",
  replicaHealth: "HEALTHY",
};

export const MOCK_WAL = {
  entries: 48291,
  lastFlush: "2s ago",
  lastSnapshot: "14 minutes ago",
  snapshotSizeMb: 142,
  walSizeMb: 8.4,
  recoveryTimeEstimateSec: 3.2,
};

export const MOCK_GOSSIP = {
  protocol: "SWIM",
  roundsCompleted: 18482,
  suspectNodes: ["node-3"],
  failedNodes: [] as string[],
  convergenceMs: 280,
  lastHeartbeat: "800ms ago",
  membershipVersion: 47,
};

export const MOCK_REBALANCER = {
  status: "IDLE",
  lastEvent: "NODE_ADD",
  lastEventTime: "2h ago",
  keysMovedLastRebalance: 8.3,
  pendingDrains: 0,
  warmupNodes: [] as string[],
};

export const MOCK_CIRCUIT_BREAKER = {
  status: "CLOSED",
  openCount: 2,
  lastOpened: "34m ago",
  successRate: 99.2,
  timeoutRate: 0.3,
};

export const MOCK_RATE_LIMITER = {
  algorithm: "Token Bucket",
  globalRps: 10000,
  currentRps: 2840,
  rejectedLastMin: 0,
  tenants: [
    { name: "edgefabric", limit: 5000, current: 1420 },
    { name: "store", limit: 3000, current: 980 },
    { name: "platform", limit: 2000, current: 440 },
  ],
};

export const MOCK_CHAOS_HISTORY = [
  {
    id: 1, type: "NODE_TERMINATION", target: "node-3", time: "Yesterday 14:23",
    duration: "5min", impact: "p95 rose to 18ms", sloBreached: false, status: "COMPLETED",
  },
  {
    id: 2, type: "LATENCY_INJECTION", target: "node-1", time: "2 days ago 09:11",
    duration: "2min", impact: "Hit rate dropped to 87%", sloBreached: false, status: "COMPLETED",
  },
  {
    id: 3, type: "PACKET_LOSS", target: "all", time: "3 days ago 16:45",
    duration: "1min", impact: "None — system handled gracefully", sloBreached: false, status: "COMPLETED",
  },
];

export const MOCK_MCP_ACTIONS = [
  {
    id: 1, tool: "observe", query: "Show cluster health summary",
    response: "3 nodes online. node-3 is SUSPECT with CPU at 71%. Recommend drain.",
    time: "10:42 AM", status: "COMPLETE",
  },
  {
    id: 2, tool: "act", query: "Drain node-3",
    response: "Action requires human approval. node-3 holds 269K keys. Drain will trigger rebalance.",
    time: "10:43 AM", status: "AWAITING_APPROVAL",
  },
];

export const MOCK_SECURITY = {
  mtlsEnabled: true,
  certExpiry: "89 days",
  lastRotation: "12 days ago",
  authMode: "Token + TLS",
  activeSessions: 3,
};

export const MOCK_CICD = {
  lastBuild: "14 minutes ago",
  branch: "main",
  status: "PASSING",
  coverage: 84.2,
  unitTests: { total: 312, passed: 312, failed: 0 },
  integrationTests: { total: 48, passed: 47, failed: 1 },
  chaosTests: { total: 12, passed: 11, failed: 1 },
};

export const MOCK_GOSSIP_LOG = [
  { time: "10:42:01.234", event: "HEARTBEAT_SENT", source: "node-1", target: "node-2", details: "Round 18482" },
  { time: "10:42:01.236", event: "HEARTBEAT_ACK", source: "node-2", target: "node-1", details: "Ack OK" },
  { time: "10:42:01.450", event: "HEARTBEAT_SENT", source: "node-2", target: "node-3", details: "Round 18482" },
  { time: "10:42:02.460", event: "NODE_SUSPECT", source: "node-2", target: "node-3", details: "No ack after 1000ms" },
  { time: "10:42:03.100", event: "GOSSIP_ROUND_START", source: "node-1", target: "all", details: "Round 18483" },
  { time: "10:42:03.102", event: "HEARTBEAT_SENT", source: "node-1", target: "node-3", details: "Indirect probe" },
  { time: "10:42:03.380", event: "HEARTBEAT_ACK", source: "node-3", target: "node-1", details: "Ack OK (late)" },
  { time: "10:42:03.382", event: "NODE_RECOVER", source: "node-1", target: "node-3", details: "Cleared suspect" },
  { time: "10:42:03.900", event: "MEMBERSHIP_UPDATE", source: "node-1", target: "all", details: "Version 47" },
  { time: "10:42:04.100", event: "HEARTBEAT_SENT", source: "node-1", target: "node-2", details: "Round 18483" },
];

export const MOCK_WAL_ENTRIES = [
  { seq: 48291, op: "PUT", key: "user:1042", tenant: "edgefabric", timestamp: "10:42:01.234", size: "284B" },
  { seq: 48290, op: "PUT", key: "session:abc", tenant: "store", timestamp: "10:42:01.102", size: "512B" },
  { seq: 48289, op: "PUT", key: "product:99", tenant: "platform", timestamp: "10:42:00.890", size: "1.2KB" },
  { seq: 48288, op: "DELETE", key: "cache:tmp", tenant: "edgefabric", timestamp: "10:41:59.445", size: "0B" },
  { seq: 48287, op: "PUT", key: "flag:beta", tenant: "edgefabric", timestamp: "10:41:58.200", size: "64B" },
];

export const MOCK_SNAPSHOTS = [
  { id: "snap-014", timestamp: "14 minutes ago", size: "142 MB", keys: 825870, status: "COMPLETE" },
  { id: "snap-013", timestamp: "1 hour ago", size: "140 MB", keys: 821200, status: "COMPLETE" },
  { id: "snap-012", timestamp: "2 hours ago", size: "138 MB", keys: 818400, status: "COMPLETE" },
];

export const MOCK_NODE_TIMELINE = [
  { time: "2h ago", event: "NODE_JOIN", node: "node-3", details: "Node registered from us-east-1c" },
  { time: "2h ago", event: "REBALANCE_START", node: "cluster", details: "Triggered by node addition" },
  { time: "1h 58m ago", event: "REBALANCE_DONE", node: "cluster", details: "Moved 8.3% of keys" },
  { time: "45m ago", event: "NODE_SUSPECT", node: "node-3", details: "High CPU detected (71%)" },
  { time: "44m ago", event: "NODE_RECOVER", node: "node-3", details: "Heartbeat restored" },
];

export const MOCK_DEPLOYMENT_HISTORY = [
  { version: "v2.1.0", time: "14m ago", duration: "2m 34s", strategy: "Rolling", status: "DEPLOYED" },
  { version: "v2.0.3", time: "2d ago", duration: "1m 58s", strategy: "Rolling", status: "DEPLOYED" },
  { version: "v2.0.2", time: "5d ago", duration: "3m 12s", strategy: "Rolling", status: "ROLLED_BACK" },
];

import { FLAGS } from '../config/flags';
import { MOCK_METRICS, MOCK_NODES } from '../mock/mockData';

const BASE_URL = "http://EdgeFabric-Dev-nlb-43f35c0cfe88674d.elb.us-east-1.amazonaws.com";
const REGISTRY_URL = "http://44.201.156.30:8080";

export async function getActiveNodes() {
  if (!FLAGS.REGISTRY) {
    return { data: { registryVersion: 5, activeNodes: MOCK_NODES.map(n => ({ cacheNodeId: n.id, host: n.host, port: n.port })) }, source: 'mock' as const };
  }
  try {
    const res = await fetch(`${REGISTRY_URL}/registry/active/nodes`);
    const data = await res.json();
    return { data, source: 'live' as const };
  } catch {
    return { data: { registryVersion: 5, activeNodes: MOCK_NODES.map(n => ({ cacheNodeId: n.id, host: n.host, port: n.port })) }, source: 'mock' as const };
  }
}

export async function getSystemHealth() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/system/health`);
    const data = await res.json();
    return { data, source: 'live' as const };
  } catch {
    return { data: { status: "UP", nodes: 3 }, source: 'mock' as const };
  }
}

export async function putCache(key: string, value: string | ArrayBuffer, tenant: string, ttlMs: number, contentType: string) {
  if (!FLAGS.CACHE_OPS) {
    return { data: { status: 'OK' }, source: 'mock' as const, latency: 2 };
  }
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/v1/cache/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: { 'X-Tenant': tenant, 'X-TTL-MS': String(ttlMs), 'Content-Type': contentType },
      body: value,
    });
    const latency = Date.now() - t0;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { data: { status: 'OK' }, source: 'live' as const, latency };
  } catch (e: any) {
    const latency = Date.now() - t0;
    throw { message: e.message, latency };
  }
}

export async function getCache(key: string, tenant: string) {
  if (!FLAGS.CACHE_OPS) {
    return { data: null, source: 'mock' as const, latency: 2, hit: false, contentType: '' };
  }
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/v1/cache/${encodeURIComponent(key)}`, {
      headers: { 'X-Tenant': tenant },
    });
    const latency = Date.now() - t0;
    if (res.status === 404) {
      return { data: null, source: 'live' as const, latency, hit: false, contentType: '' };
    }
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const blob = await res.blob();
    return { data: blob, source: 'live' as const, latency, hit: true, contentType };
  } catch (e: any) {
    const latency = Date.now() - t0;
    throw { message: e.message, latency };
  }
}

export async function registerNode(cacheNodeId: string, host: string, port: number) {
  try {
    const res = await fetch(`${REGISTRY_URL}/registry/node/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cacheNodeId, host, port }),
    });
    return { data: await res.json(), source: 'live' as const };
  } catch {
    return { data: { status: 'registered' }, source: 'mock' as const };
  }
}

export function getMetrics() {
  return { data: MOCK_METRICS, source: 'mock' as const };
}

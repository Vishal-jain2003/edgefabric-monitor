interface StatusBadgeProps {
  status: 'HEALTHY' | 'SUSPECT' | 'FAILED' | 'MOCKED' | 'UP' | 'DEGRADED' | 'CRITICAL' | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { dot: string; text: string; bg: string }> = {
    HEALTHY: { dot: 'bg-ef-green animate-pulse-glow', text: 'text-ef-green', bg: 'bg-ef-green/10' },
    UP: { dot: 'bg-ef-green animate-pulse-glow', text: 'text-ef-green', bg: 'bg-ef-green/10' },
    SUSPECT: { dot: 'bg-ef-amber animate-pulse-glow', text: 'text-ef-amber', bg: 'bg-ef-amber/10' },
    DEGRADED: { dot: 'bg-ef-amber animate-pulse-glow', text: 'text-ef-amber', bg: 'bg-ef-amber/10' },
    FAILED: { dot: 'bg-ef-red', text: 'text-ef-red', bg: 'bg-ef-red/10' },
    CRITICAL: { dot: 'bg-ef-red animate-pulse-glow', text: 'text-ef-red', bg: 'bg-ef-red/10' },
    MOCKED: { dot: 'bg-muted-foreground', text: 'text-muted-foreground', bg: 'bg-muted/50' },
  };

  const c = config[status] || config.MOCKED;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${c.text} ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

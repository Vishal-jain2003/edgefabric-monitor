interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  color?: 'cyan' | 'green' | 'amber' | 'red' | 'purple' | 'blue';
  live?: boolean;
}

export function MetricCard({ label, value, unit, trend, color = 'cyan', live }: MetricCardProps) {
  const colorMap = {
    cyan: 'text-ef-cyan border-ef-cyan',
    green: 'text-ef-green',
    amber: 'text-ef-amber',
    red: 'text-ef-red',
    purple: 'text-ef-purple',
    blue: 'text-ef-blue',
  };

  return (
    <div className="glass-card p-4 relative animate-count-up">
      {live && (
        <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-ef-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-ef-cyan animate-pulse-glow" />
          LIVE
        </span>
      )}
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={`font-mono text-2xl font-bold ${colorMap[color]}`}>
        {value}
        {unit && <span className="text-sm ml-1 text-muted-foreground">{unit}</span>}
      </p>
      {trend && (
        <p className={`text-[10px] mt-1 ${trend.startsWith('+') ? 'text-ef-green' : trend.startsWith('-') ? 'text-ef-red' : 'text-muted-foreground'}`}>
          {trend}
        </p>
      )}
    </div>
  );
}

interface SimulatedBadgeProps {
  sprint?: number;
  label?: string;
}

export function SimulatedBadge({ sprint, label }: SimulatedBadgeProps) {
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-muted/60 text-muted-foreground italic cursor-help"
      title={sprint ? `Backend ships in Sprint ${sprint}` : 'Using mock data'}
    >
      🔮 {label || `Simulated${sprint ? ` · Sprint ${sprint}` : ''}`}
    </span>
  );
}

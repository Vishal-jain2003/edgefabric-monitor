interface HashRingVizProps {
  nodes: { id: string; status: string }[];
  size?: number;
}

export function HashRingViz({ nodes, size = 280 }: HashRingVizProps) {
  const center = size / 2;
  const radius = size / 2 - 30;
  const vnodesPerNode = 150;

  const statusColor: Record<string, string> = {
    HEALTHY: '#00E676',
    SUSPECT: '#FFB300',
    FAILED: '#FF1744',
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Ring */}
      <circle cx={center} cy={center} r={radius} fill="none" stroke="hsl(215 20% 15%)" strokeWidth="2" />
      
      {/* Node arcs */}
      {nodes.map((node, i) => {
        const startAngle = (i / nodes.length) * 360 - 90;
        const endAngle = ((i + 1) / nodes.length) * 360 - 90;
        const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
        const startRad = startAngle * (Math.PI / 180);
        const endRad = endAngle * (Math.PI / 180);
        
        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        const labelX = center + (radius + 18) * Math.cos(midAngle);
        const labelY = center + (radius + 18) * Math.sin(midAngle);
        const color = statusColor[node.status] || '#445566';

        return (
          <g key={node.id}>
            <path
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={0.8}
            />
            {/* Virtual node ticks */}
            {Array.from({ length: 6 }, (_, vi) => {
              const tickAngle = (startAngle + (vi / 6) * (endAngle - startAngle)) * (Math.PI / 180);
              const tx1 = center + (radius - 6) * Math.cos(tickAngle);
              const ty1 = center + (radius - 6) * Math.sin(tickAngle);
              const tx2 = center + (radius + 6) * Math.cos(tickAngle);
              const ty2 = center + (radius + 6) * Math.sin(tickAngle);
              return <line key={vi} x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={color} strokeWidth="1" opacity={0.4} />;
            })}
            {/* Node dot */}
            <circle
              cx={center + radius * Math.cos(midAngle)}
              cy={center + radius * Math.sin(midAngle)}
              r={6}
              fill={color}
            />
            {/* Label */}
            <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="10" fontFamily="IBM Plex Mono">
              {node.id}
            </text>
          </g>
        );
      })}

      {/* Center text */}
      <text x={center} y={center - 8} textAnchor="middle" fill="#8899AA" fontSize="10" fontFamily="IBM Plex Mono">
        {vnodesPerNode * nodes.length} vnodes
      </text>
      <text x={center} y={center + 8} textAnchor="middle" fill="#E8EDF2" fontSize="12" fontFamily="Syne" fontWeight="600">
        Hash Ring
      </text>
    </svg>
  );
}

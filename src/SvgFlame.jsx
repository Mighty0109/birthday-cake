import { useState, useEffect, useRef } from "react";

// ============================================================
// 🔥 촛불 불꽃 (SVG)
// ============================================================

export function SvgFlame({ cx, cy, lit, tiltX = 0, blowIntensity = 0, delay = 0 }) {
  const [flicker, setFlicker] = useState(0);
  const gradId = useRef(`fl_${Math.random().toString(36).slice(2, 7)}`);

  useEffect(() => {
    if (!lit) return;
    const id = setInterval(() => setFlicker(Math.random() * 5 - 2.5), 90 + delay * 12);
    return () => clearInterval(id);
  }, [lit, delay]);

  if (!lit) return null;

  const angle = tiltX * 1.2 + flicker;
  const sc = Math.max(0.05, 1 - blowIntensity * 0.8);
  const op = Math.max(0.15, 1 - blowIntensity * 0.5);

  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={op}>
      <circle cx="0" cy="-8" r="10" fill="rgba(255,180,60,0.35)" />
      <g transform={`rotate(${angle}, 0, 0) scale(1, ${sc})`}>
        <defs>
          <linearGradient id={gradId.current} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#D4572A" />
            <stop offset="35%" stopColor="#E8872A" />
            <stop offset="65%" stopColor="#F0C040" />
            <stop offset="100%" stopColor="#FFF8DC" />
          </linearGradient>
        </defs>
        <path
          d="M0,-2 C2,-6 5,-10 4,-14 C5,-17 3,-20 0,-22 C-3,-20 -5,-17 -4,-14 C-5,-10 -2,-6 0,-2 Z"
          fill={`url(#${gradId.current})`}
          stroke="#C4572A"
          strokeWidth="0.6"
        />
      </g>
    </g>
  );
}

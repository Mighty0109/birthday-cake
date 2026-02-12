import { C } from "../constants/theme";

// ============================================================
// ✦ 별 장식 (레트로퓨처리즘)
// ============================================================

export function Starburst({ size = 60, color = C.mustard, style = {} }) {
  const points = 12;
  const inner = size * 0.35;
  const outer = size * 0.5;
  let d = "";
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
    const nextAngle = ((i + 0.5) / points) * Math.PI * 2 - Math.PI / 2;
    const ox = size / 2 + Math.cos(angle) * outer;
    const oy = size / 2 + Math.sin(angle) * outer;
    const ix = size / 2 + Math.cos(nextAngle) * inner;
    const iy = size / 2 + Math.sin(nextAngle) * inner;
    d += (i === 0 ? "M" : "L") + `${ox},${oy} L${ix},${iy} `;
  }
  d += "Z";
  return (
    <svg width={size} height={size} style={{ ...style, opacity: 0.15 }} viewBox={`0 0 ${size} ${size}`}>
      <path d={d} fill={color} />
    </svg>
  );
}

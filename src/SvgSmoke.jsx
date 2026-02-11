import { useState, useEffect } from "react";

// ============================================================
// 💨 B급 연기 이펙트
// ============================================================

export function SvgSmoke({ cx, cy, delay = 0, age = 1, tiltX = 0 }) {
  const [puffStates, setPuffStates] = useState([]);
  const intensity = Math.min(age, 25);
  const puffCount = Math.min(3, 1 + Math.floor(intensity / 8));
  const baseSize = 3 + intensity * 0.3;

  useEffect(() => {
    const initPuffs = Array.from({ length: puffCount }, (_, p) => ({
      t: -(delay * 0.3 + p * 0.7),
      dur: 1.8 + p * 0.5,
      wobbleDir: p % 2 === 0 ? -1 : 1,
      wobbleAmt: 4 + p * 2,
      size: baseSize + p * 1.5,
    }));
    setPuffStates(initPuffs);

    const id = setInterval(() => {
      setPuffStates((prev) =>
        prev.map((puff) => {
          let t = puff.t + 0.05;
          if (t > puff.dur) t = 0;
          return { ...puff, t };
        })
      );
    }, 50);
    return () => clearInterval(id);
  }, [puffCount]);

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {puffStates.map((puff, p) => {
        if (puff.t < 0) return null;
        const progress = puff.t / puff.dur;
        const y = -progress * (25 + p * 12);
        const baseWobble = puff.wobbleDir * puff.wobbleAmt * progress;
        const tiltOffset = tiltX * progress * 1.5;
        const x = baseWobble + tiltOffset;
        const r = puff.size * (0.5 + progress * 1.3);
        const op =
          progress < 0.15
            ? (progress / 0.15) * 0.5
            : progress < 0.6
            ? 0.5 - (progress - 0.15) * 0.4
            : Math.max(0, 0.32 - (progress - 0.6) * 0.8);
        return <circle key={p} cx={x} cy={y} r={r} fill="#AAA" opacity={op} />;
      })}
    </g>
  );
}

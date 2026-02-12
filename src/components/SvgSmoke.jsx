import { useState, useEffect } from "react";

// ============================================================
// 💨 B급 연기 이펙트
// ============================================================

export function SvgSmoke({ cx, cy, delay = 0, age = 1, tiltX = 0 }) {
  const [puffStates, setPuffStates] = useState([]);
  const intensity = Math.min(age, 25);
  const puffCount = Math.min(5, 2 + Math.floor(intensity / 5));
  const baseSize = 6 + intensity * 0.5;

  useEffect(() => {
    const initPuffs = Array.from({ length: puffCount }, (_, p) => ({
      t: -(delay * 0.3 + p * 0.6),
      dur: 2.2 + p * 0.8,
      wobbleDir: p % 2 === 0 ? -1 : 1,
      wobbleAmt: 5 + p * 2.5,
      size: baseSize + p * 2,
    }));
    setPuffStates(initPuffs);

    const id = setInterval(() => {
      setPuffStates((prev) =>
        prev.map((puff) => {
          let t = puff.t + 0.04;
          if (t > puff.dur) t = 0;
          return { ...puff, t };
        })
      );
    }, 40);
    return () => clearInterval(id);
  }, [puffCount]);

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {puffStates.map((puff, p) => {
        if (puff.t < 0) return null;
        const progress = puff.t / puff.dur;
        const y = -progress * (35 + p * 15);
        const baseWobble = puff.wobbleDir * puff.wobbleAmt * progress;
        const tiltOffset = tiltX * progress * 1.5;
        const x = baseWobble + tiltOffset;
        const r = puff.size * (0.5 + progress * 1.5);
        const op =
          progress < 0.1
            ? (progress / 0.1) * 0.8
            : progress < 0.5
            ? 0.8 - (progress - 0.1) * 0.3
            : Math.max(0, 0.68 - (progress - 0.5) * 1.1);
        return <circle key={p} cx={x} cy={y} r={r} fill="#CCC" opacity={op} />;
      })}
    </g>
  );
}

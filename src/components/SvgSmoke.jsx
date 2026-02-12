import { useState, useEffect } from "react";

// ============================================================
// 💨 B급 연기 이펙트 (수정: 연기 줄임 + 잘림 방지)
// ============================================================

export function SvgSmoke({ cx, cy, delay = 0, age = 1, tiltX = 0 }) {
  const [puffStates, setPuffStates] = useState([]);
  const intensity = Math.min(age, 25);
  // 🔧 연기 양 줄임: 최대 2개 (기존 4개)
  const puffCount = Math.min(2, 1 + Math.floor(intensity / 15));
  // 🔧 크기 줄임 (기존 5 + intensity * 0.4)
  const baseSize = 2 + intensity * 0.12;

  useEffect(() => {
    const initPuffs = Array.from({ length: puffCount }, (_, p) => ({
      t: -(delay * 0.3 + p * 0.7),
      dur: 1.8 + p * 0.5,
      wobbleDir: p % 2 === 0 ? -1 : 1,
      wobbleAmt: 3 + p * 1,
      size: baseSize + p * 0.8,
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
        // 🔧 연기 높이 줄임 (기존 25 + p * 12 → 15 + p * 5)
        const y = -progress * (15 + p * 5);
        const baseWobble = puff.wobbleDir * puff.wobbleAmt * progress;
        const tiltOffset = tiltX * progress * 1.5;
        const x = baseWobble + tiltOffset;
        const r = puff.size * (0.5 + progress * 0.7);
        // 🔧 불투명도 줄임 (기존 0.7 → 0.35)
        const op =
          progress < 0.15
            ? (progress / 0.15) * 0.35
            : progress < 0.6
            ? 0.35 - (progress - 0.15) * 0.25
            : Math.max(0, 0.2 - (progress - 0.6) * 0.5);
        return <circle key={p} cx={x} cy={y} r={r} fill="#AAA" opacity={op} />;
      })}
    </g>
  );
}

import { useRef } from "react";
import { C } from "../constants/theme";

// ============================================================
// 🎊 레트로 색종이 효과
// ============================================================

export function WarmConfetti() {
  const pieces = useRef(
    Array.from({ length: 45 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      dur: 2.5 + Math.random() * 2,
      color: [C.dustyPink, C.mustard, C.sage, C.orange, "#B8A0D4", C.cream, "#D4B878"][Math.floor(Math.random() * 7)],
      size: 6 + Math.random() * 8,
      rot: Math.random() * 360,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }))
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, overflow: "hidden" }}>
      {pieces.current.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: -15,
            width: p.shape === "circle" ? p.size : p.size * 0.6,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            border: `1px solid ${C.ink}20`,
            animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

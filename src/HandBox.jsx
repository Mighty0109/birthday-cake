import { useRef } from "react";
import { C } from "../constants/theme";

// ============================================================
// ✏️ 손으로 그린 테두리 박스
// ============================================================

export function HandBox({ children, color = C.brown, style = {} }) {
  const id = useRef(`hb_${Math.random().toString(36).slice(2, 7)}`);
  return (
    <div style={{ position: "relative", padding: "18px 20px", ...style }}>
      <svg
        style={{ position: "absolute", inset: -4, width: "calc(100% + 8px)", height: "calc(100% + 8px)", pointerEvents: "none" }}
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M4,6 Q2,2 8,3 L190,5 Q198,4 197,9 L196,90 Q197,97 192,96 L8,94 Q2,95 3,90 Z"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
      </svg>
      {children}
    </div>
  );
}

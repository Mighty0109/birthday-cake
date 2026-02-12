import { useState, useEffect } from "react";
import { C, FONT } from "../constants/theme";
import { getCakeTheme } from "../utils/cakeTheme";
import { SvgFlame } from "./SvgFlame";
import { SvgSmoke } from "./SvgSmoke";

// ============================================================
// 🎂 올인원 케이크 SVG
// ============================================================

export function WarmCake({ age, name, candlesLit, tiltX, blowIntensity, justBlownOut = false }) {
  const theme = getCakeTheme(age);
  const numCandles = Math.min(age, 25);
  const [showSmoke, setShowSmoke] = useState(false);

  // 연기: justBlownOut이 true면 3초간 표시
  useEffect(() => {
    if (justBlownOut) {
      setShowSmoke(true);
      const t = setTimeout(() => setShowSmoke(false), 3000);
      return () => clearTimeout(t);
    } else {
      setShowSmoke(false);
    }
  }, [justBlownOut]);

  // 초 위치 계산
  const candlePositions = [];
  const rowCount = numCandles <= 8 ? 1 : 2;

  if (rowCount === 1) {
    const totalW = 180;
    const spacing = numCandles <= 1 ? 0 : totalW / (numCandles - 1);
    const startX = 150 - totalW / 2;
    for (let i = 0; i < numCandles; i++) {
      candlePositions.push({ x: startX + i * spacing, row: 0 });
    }
  } else {
    const topRow = Math.ceil(numCandles / 2);
    const botRow = numCandles - topRow;
    const totalW1 = 186;
    const spacing1 = topRow <= 1 ? 0 : totalW1 / (topRow - 1);
    const startX1 = 150 - totalW1 / 2;
    for (let i = 0; i < topRow; i++) {
      candlePositions.push({ x: startX1 + i * spacing1, row: 0 });
    }
    const totalW2 = 160;
    const spacing2 = botRow <= 1 ? 0 : totalW2 / (botRow - 1);
    const startX2 = 150 - totalW2 / 2;
    for (let i = 0; i < botRow; i++) {
      candlePositions.push({ x: startX2 + i * spacing2, row: 1 });
    }
  }

  const colors = [C.dustyPink, C.sage, C.mustard, C.orange, "#B8A0D4", "#7CB8B8", "#D4B878", "#C47878"];
  const vTop = -50;
  const vH = 160 - vTop;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox={`0 ${vTop} 300 ${vH}`} width="min(82vw, 310px)" style={{ display: "block", overflow: "visible" }}>
        {/* 접시 그림자 */}
        <ellipse cx="150" cy="152" rx="155" ry="8" fill="rgba(0,0,0,0.12)" />
        {/* 접시 */}
        <path
          d="M-2,146 Q0,154 150,156 Q300,154 302,146 Q300,142 150,144 Q0,142 -2,146 Z"
          fill={theme.plate} stroke={C.ink} strokeWidth="2" strokeLinejoin="round"
        />
        {/* 하단 레이어 */}
        <path
          d="M25,144 Q23,100 30,93 Q70,85 150,87 Q230,85 270,93 Q277,100 275,144 Z"
          fill={theme.cake} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        />
        <path d="M50,120 Q80,115 110,120 Q140,125 170,120 Q200,115 230,120 Q250,123 260,120"
          fill="none" stroke={theme.frost} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M45,133 Q90,127 150,131 Q210,127 255,133"
          fill="none" stroke={theme.frost} strokeWidth="2" strokeLinecap="round" strokeDasharray="6,4" opacity="0.4" />
        {/* 상단 레이어 */}
        <path
          d="M45,93 Q43,53 50,47 Q85,39 150,41 Q215,39 250,47 Q257,53 255,93 Z"
          fill={theme.cake2} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        />
        {/* 프로스팅 윗면 */}
        <ellipse cx="150" cy="44" rx="103" ry="10" fill={theme.frost} stroke={C.ink} strokeWidth="2" />
        {/* 프로스팅 드립 */}
        {[{ x: 68, h: 18 }, { x: 110, h: 26 }, { x: 185, h: 22 }, { x: 238, h: 16 }].map((d, i) => (
          <g key={i}>
            <path d={`M${d.x},48 Q${d.x - 2},${48 + d.h * 0.6} ${d.x + 1},${48 + d.h}`}
              fill="none" stroke={theme.frost} strokeWidth={6 + (i % 2) * 2} strokeLinecap="round" />
            <path d={`M${d.x},48 Q${d.x - 2},${48 + d.h * 0.6} ${d.x + 1},${48 + d.h}`}
              fill="none" stroke={C.ink} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
          </g>
        ))}
        {/* 장식 */}
        {[{ x: 80, y: 108 }, { x: 150, y: 106 }, { x: 220, y: 110 }].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3 + (i % 2)} fill={theme.accent} stroke={C.ink} strokeWidth="1" opacity="0.7" />
        ))}
        {/* 이름 */}
        <text x="150" y="125" textAnchor="middle"
          style={{ fontFamily: FONT, fontSize: Math.min(20, Math.max(12, 200 / Math.max(name.length, 1))), fill: theme.frost, fontWeight: 700 }}
          stroke={C.ink} strokeWidth="0.5" transform="rotate(-1.5, 150, 125)">
          {name}
        </text>
        <text x="90" y="75" style={{ fontSize: 10, fontFamily: FONT }} fill={theme.accent} opacity="0.5">✦</text>
        <text x="200" y="73" style={{ fontSize: 8, fontFamily: FONT }} fill={theme.accent} opacity="0.5">✦</text>

        {/* 초 */}
        {candlePositions.map((pos, i) => {
          const color = colors[i % colors.length];
          const h = 22 + (i % 3) * 4;
          const lean = i % 2 === 0 ? -1 : 1;
          const baseY = 42 - pos.row * 4;
          const candleTop = baseY - h;
          return (
            <g key={i}>
              <rect x={pos.x - 3} y={candleTop} width={6} height={h} rx={1}
                fill={color} stroke={C.ink} strokeWidth="1.2"
                transform={`rotate(${lean}, ${pos.x}, ${baseY})`} />
              <line x1={pos.x - 2} y1={candleTop + h * 0.5} x2={pos.x + 2} y2={candleTop + h * 0.5}
                stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${lean}, ${pos.x}, ${baseY})`} />
              <line x1={pos.x} y1={candleTop - 3} x2={pos.x + lean * 0.3} y2={candleTop}
                stroke={C.ink} strokeWidth="1" strokeLinecap="round"
                transform={`rotate(${lean}, ${pos.x}, ${baseY})`} />
              <SvgFlame cx={pos.x} cy={candleTop - 3} lit={candlesLit} tiltX={tiltX} blowIntensity={blowIntensity} delay={i} />
              {showSmoke && (
                <SvgSmoke cx={pos.x} cy={candleTop - 5} delay={i * 0.15} age={age} tiltX={tiltX} />
              )}
            </g>
          );
        })}
      </svg>

      {/* 50세 이상 화재경보 */}
      {age >= 50 && (
        <div style={{
          marginTop: 10, padding: "6px 16px",
          background: C.orange, border: `2px solid ${C.ink}`,
          borderRadius: 20, fontFamily: FONT, fontSize: 14, fontWeight: 700,
          color: C.cream, animation: "blink 0.5s infinite",
          transform: "rotate(-2deg)",
          boxShadow: `2px 2px 0 ${C.ink}`,
        }}>
          🚨 화재경보 발령 🚨
        </div>
      )}
    </div>
  );
}

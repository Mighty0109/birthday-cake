import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// 🎂 "촛불 끄셈 ㅋㅋ" - 2026 WARM RETRO EDITION
// ============================================================

// ============================================================
// GOOGLE ADSENSE BANNER
// ============================================================
function AdBanner({ slot = "XXXXXXXXXX", format = "auto", style = {} }) {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [adReady, setAdReady] = useState(false);

  useEffect(() => {
    // Only render ad if AdSense script is actually loaded
    if (window.adsbygoogle && !pushed.current) {
      setAdReady(true);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.log("AdSense error:", e);
      }
    }
  }, []);

  if (!adReady) return null;

  return (
    <div style={{ width: "100%", maxWidth: 360, margin: "16px auto", textAlign: "center", overflow: "hidden", ...style }}>
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{ display: "block" }}
        data-ad-client="ca-pub-3089729030829076"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

const FONT = "'Gaegu', cursive";
const FONT_EN = "'Caveat', cursive";

// Warm retro palette
const C = {
  cream: "#FFF8EE",
  paper: "#F5E6D0",
  warmBg: "#2C1810",
  darkBg: "#1A0E08",
  orange: "#E8722A",
  mustard: "#D4A535",
  dustyPink: "#D4847C",
  sage: "#8FA77A",
  brown: "#6B4226",
  ink: "#2C1810",
  faded: "#B8A089",
};

const ROASTS = {
  child: [
    "우와~ 벌써 {age}살이야?! 다 컸네!! ☆",
    "{age}살 축하해! 산타 아직 믿지?",
    "짝짝짝! {age}살 되셨습니다~",
  ],
  teen: [
    "{age}살 ㅊㅋ~ 사춘기 파이팅 ㅋ",
    "중2병은 나았어? {age}살 축하 ㅋ",
    "{age}살이면... 아직 급식충? ㅋㅋ",
  ],
  twenty: [
    "{age}살 축하~ MZ세대 등록 완료",
    "이제 {age}살이면 중고신입 ㅋㅋ",
    "{age}번째 생존 축하 ㅋ 대출 화이팅",
    "{age}살? 벌써 아재 소리 들을 나이",
  ],
  thirty: [
    "{age}살 ㅊㅋ... 무릎 조심해 ㅎ",
    "30대 입장~ {age}살 건강검진 필수",
    "{age}살이면 요즘것들 시전 가능 ㅋ",
    "축하합니다 {age}살! 10시면 졸리죠?",
  ],
  forty: [
    "{age}살 축하드립니다 선배님...",
    "불이 너무 많아서 소방서 신고할뻔",
    "{age}개의 초... 케이크가 불바다 ㅋ",
    "{age}살 축하! 건강이 최고 진짜로",
  ],
  fifty: [
    "소방차 출동!! {age}살 생축!!",
    "{age}살?! 레전드... 존경합니다",
    "초 {age}개는 화재 위험 ㅋㅋㅋ",
    "{age}번째 생일 축하 대선배님!!",
  ],
};

function getRoast(age) {
  let cat;
  if (age <= 12) cat = "child";
  else if (age <= 19) cat = "teen";
  else if (age <= 29) cat = "twenty";
  else if (age <= 39) cat = "thirty";
  else if (age <= 49) cat = "forty";
  else cat = "fifty";
  const list = ROASTS[cat];
  return list[Math.floor(Math.random() * list.length)].replace("{age}", age);
}

function getCakeTheme(age) {
  if (age <= 12) return { cake: "#F4B8C1", cake2: "#E899A4", frost: "#FFF5DC", plate: "#D4A574", label: "귀요미 케이크", accent: "#E8722A" };
  if (age <= 19) return { cake: "#B8D4A8", cake2: "#8FA77A", frost: "#FFF8EE", plate: "#8B7355", label: "급식 특별 케이크", accent: "#D4A535" };
  if (age <= 29) return { cake: "#D4A535", cake2: "#B8892A", frost: "#FFF8EE", plate: "#6B4226", label: "힙한 빈티지 케이크", accent: "#E8722A" };
  if (age <= 39) return { cake: "#C4694A", cake2: "#A85535", frost: "#FFF5DC", plate: "#4A3020", label: "인생 반환점 케이크", accent: "#D4847C" };
  return { cake: "#8B3A3A", cake2: "#6B2A2A", frost: "#E8722A", plate: "#3A2010", label: "소방관 출동 케이크", accent: "#D4A535" };
}

function encodeData(obj) {
  try { return btoa(encodeURIComponent(JSON.stringify(obj)).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))); }
  catch { return ""; }
}
function decodeData(str) {
  try { return JSON.parse(decodeURIComponent(Array.from(atob(str)).map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""))); }
  catch { return null; }
}

// ============================================================
// PAPER TEXTURE + GRAIN OVERLAY
// ============================================================
function PaperGrain({ dark = false }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}>
      {/* Noise grain */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: dark ? 0.15 : 0.08 }}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      {/* Subtle vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)" }} />
    </div>
  );
}

// ============================================================
// HAND-DRAWN BORDER BOX
// ============================================================
function HandBox({ children, color = C.brown, style = {} }) {
  const id = useRef(`hb_${Math.random().toString(36).slice(2,7)}`);
  return (
    <div style={{ position: "relative", padding: "18px 20px", ...style }}>
      <svg style={{ position: "absolute", inset: -4, width: "calc(100% + 8px)", height: "calc(100% + 8px)", pointerEvents: "none" }} viewBox="0 0 200 100" preserveAspectRatio="none">
        <path
          d="M4,6 Q2,2 8,3 L190,5 Q198,4 197,9 L196,90 Q197,97 192,96 L8,94 Q2,95 3,90 Z"
          fill="none" stroke={color} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
      </svg>
      {children}
    </div>
  );
}

// ============================================================
// STARBURST DECORATION (retrofuturism)
// ============================================================
function Starburst({ size = 60, color = C.mustard, style = {} }) {
  const points = 12;
  const inner = size * 0.35;
  const outer = size * 0.5;
  let d = "";
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
    const nextAngle = ((i + 0.5) / points) * Math.PI * 2 - Math.PI / 2;
    const ox = size/2 + Math.cos(angle) * outer;
    const oy = size/2 + Math.sin(angle) * outer;
    const ix = size/2 + Math.cos(nextAngle) * inner;
    const iy = size/2 + Math.sin(nextAngle) * inner;
    d += (i === 0 ? "M" : "L") + `${ox},${oy} L${ix},${iy} `;
  }
  d += "Z";
  return (
    <svg width={size} height={size} style={{ ...style, opacity: 0.15 }} viewBox={`0 0 ${size} ${size}`}>
      <path d={d} fill={color} />
    </svg>
  );
}

// ============================================================
// SVG FLAME (inside SVG)
// ============================================================
function SvgFlame({ cx, cy, lit, tiltX = 0, blowIntensity = 0, delay = 0 }) {
  const [flicker, setFlicker] = useState(0);
  const gradId = useRef(`fl_${Math.random().toString(36).slice(2,7)}`);
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
      {/* Glow */}
      <circle cx="0" cy="-8" r="10" fill="rgba(255,180,60,0.35)" />
      {/* Flame */}
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
          stroke="#C4572A" strokeWidth="0.6"
        />
      </g>
    </g>
  );
}

// ============================================================
// B급 연기 이펙트 💨
// ============================================================
function SvgSmoke({ cx, cy, delay = 0, age = 1, tiltX = 0 }) {
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
      setPuffStates(prev => prev.map(puff => {
        let t = puff.t + 0.05;
        if (t > puff.dur) t = 0;
        return { ...puff, t };
      }));
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
        const op = progress < 0.15 ? progress / 0.15 * 0.5
                 : progress < 0.6 ? 0.5 - (progress - 0.15) * 0.4
                 : Math.max(0, 0.32 - (progress - 0.6) * 0.8);
        return (
          <circle key={p} cx={x} cy={y} r={r} fill="#AAA" opacity={op} />
        );
      })}
    </g>
  );
}

// ============================================================
// ALL-IN-ONE CAKE SVG
// ============================================================
function WarmCake({ age, name, candlesLit, tiltX, blowIntensity }) {
  const theme = getCakeTheme(age);
  const numCandles = Math.min(age, 25);
  
  // Calculate candle positions on the frosting top ellipse
  // Frosting top: ellipse at cy=44, rx=103 → usable width ~190px (55 to 245)
  const candlePositions = [];
  const rowCount = numCandles <= 8 ? 1 : 2;
  
  if (rowCount === 1) {
    const count = numCandles;
    const totalW = 180;
    const spacing = count <= 1 ? 0 : totalW / (count - 1);
    const startX = 150 - totalW / 2;
    for (let i = 0; i < count; i++) {
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

  // viewBox height depends on candle count
  const vTop = -50; // space for flames above
  const vH = 160 - vTop;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox={`0 ${vTop} 300 ${vH}`} width="min(82vw, 310px)" style={{ display: "block", overflow: "visible" }}>

        {/* === CAKE BODY === */}
        {/* Plate shadow */}
        <ellipse cx="150" cy="152" rx="155" ry="8" fill="rgba(0,0,0,0.12)" />
        {/* Plate */}
        <path d="M-2,146 Q0,154 150,156 Q300,154 302,146 Q300,142 150,144 Q0,142 -2,146 Z"
          fill={theme.plate} stroke={C.ink} strokeWidth="2" strokeLinejoin="round" />

        {/* Bottom layer */}
        <path d="M25,144 Q23,100 30,93 Q70,85 150,87 Q230,85 270,93 Q277,100 275,144 Z"
          fill={theme.cake} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M50,120 Q80,115 110,120 Q140,125 170,120 Q200,115 230,120 Q250,123 260,120"
          fill="none" stroke={theme.frost} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M45,133 Q90,127 150,131 Q210,127 255,133"
          fill="none" stroke={theme.frost} strokeWidth="2" strokeLinecap="round" strokeDasharray="6,4" opacity="0.4" />

        {/* Top layer */}
        <path d="M45,93 Q43,53 50,47 Q85,39 150,41 Q215,39 250,47 Q257,53 255,93 Z"
          fill={theme.cake2} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Frosting top surface */}
        <ellipse cx="150" cy="44" rx="103" ry="10" fill={theme.frost} stroke={C.ink} strokeWidth="2" />

        {/* Frosting drips */}
        {[{x:68,h:18},{x:110,h:26},{x:185,h:22},{x:238,h:16}].map((d,i) => (
          <g key={i}>
            <path d={`M${d.x},48 Q${d.x-2},${48+d.h*0.6} ${d.x+1},${48+d.h}`}
              fill="none" stroke={theme.frost} strokeWidth={6+i%2*2} strokeLinecap="round" />
            <path d={`M${d.x},48 Q${d.x-2},${48+d.h*0.6} ${d.x+1},${48+d.h}`}
              fill="none" stroke={C.ink} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
          </g>
        ))}

        {/* Decorations */}
        {[{x:80,y:108},{x:150,y:106},{x:220,y:110}].map((p,i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3+i%2} fill={theme.accent} stroke={C.ink} strokeWidth="1" opacity="0.7" />
        ))}

        {/* Name */}
        <text x="150" y="125" textAnchor="middle"
          style={{ fontFamily: FONT, fontSize: Math.min(20, Math.max(12, 200/Math.max(name.length,1))), fill: theme.frost, fontWeight: 700 }}
          stroke={C.ink} strokeWidth="0.5" transform="rotate(-1.5, 150, 125)">
          {name}
        </text>
        <text x="90" y="75" style={{ fontSize: 10, fontFamily: FONT }} fill={theme.accent} opacity="0.5">✦</text>
        <text x="200" y="73" style={{ fontSize: 8, fontFamily: FONT }} fill={theme.accent} opacity="0.5">✦</text>

        {/* === CANDLES (on top of frosting) === */}
        {candlePositions.map((pos, i) => {
          const color = colors[i % colors.length];
          const h = 22 + (i % 3) * 4;
          const lean = (i % 2 === 0) ? -1 : 1;
          const baseY = 42 - pos.row * 4; // frosting top, slightly higher for back row
          const candleTop = baseY - h;
          return (
            <g key={i}>
              {/* Candle body */}
              <rect x={pos.x - 3} y={candleTop} width={6} height={h} rx={1}
                fill={color} stroke={C.ink} strokeWidth="1.2" 
                transform={`rotate(${lean}, ${pos.x}, ${baseY})`} />
              {/* Stripe */}
              <line x1={pos.x - 2} y1={candleTop + h * 0.5} x2={pos.x + 2} y2={candleTop + h * 0.5}
                stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${lean}, ${pos.x}, ${baseY})`} />
              {/* Wick */}
              <line x1={pos.x} y1={candleTop - 3} x2={pos.x + lean * 0.3} y2={candleTop}
                stroke={C.ink} strokeWidth="1" strokeLinecap="round"
                transform={`rotate(${lean}, ${pos.x}, ${baseY})`} />
              {/* Flame */}
              <SvgFlame
                cx={pos.x} cy={candleTop - 3}
                lit={candlesLit} tiltX={tiltX} blowIntensity={blowIntensity} delay={i}
              />
              {/* B급 연기 - 불 켜져있을 때 */}
              {candlesLit && (
                <SvgSmoke cx={pos.x} cy={candleTop - 5} delay={i * 0.15} age={age} tiltX={tiltX} />
              )}
            </g>
          );
        })}

      </svg>

      {/* Fire alarm for 50+ */}
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

// ============================================================
// WARM CONFETTI (paper bits style)
// ============================================================
function WarmConfetti() {
  const pieces = useRef(
    Array.from({ length: 45 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      dur: 2.5 + Math.random() * 2,
      color: [C.dustyPink, C.mustard, C.sage, C.orange, "#B8A0D4", C.cream, "#D4B878"][Math.floor(Math.random()*7)],
      size: 6 + Math.random() * 8,
      rot: Math.random() * 360,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }))
  );
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, overflow: "hidden" }}>
      {pieces.current.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.left}%`, top: -15,
          width: p.shape === "circle" ? p.size : p.size * 0.6, height: p.size,
          background: p.color, borderRadius: p.shape === "circle" ? "50%" : "2px",
          border: `1px solid ${C.ink}20`,
          animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
          transform: `rotate(${p.rot}deg)`,
        }} />
      ))}
    </div>
  );
}

// ============================================================
// CREATE PAGE
// ============================================================
function CreatePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);

  const handleShare = () => {
    const data = encodeData({ n: name.trim(), a: parseInt(age), m: message.trim() });
    const url = `${window.location.origin}${window.location.pathname}#cake=${data}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => alert("링크 복사 완료!\n카톡이나 DM으로 보내면 돼~"));
    else prompt("링크를 복사해:", url);
  };

  if (step === 0) {
    return (
      <div style={{ ...pageStyle, background: C.paper }}>
        <PaperGrain />
        {/* Decorative starbursts */}
        <Starburst size={120} color={C.mustard} style={{ position: "absolute", top: 20, right: -20 }} />
        <Starburst size={80} color={C.dustyPink} style={{ position: "absolute", bottom: 40, left: -10 }} />

        <div style={{ animation: "fadeIn 0.6s ease-out", textAlign: "center", width: "100%", maxWidth: 360, zIndex: 1 }}>
          {/* Stamp-style header */}
          <div style={{
            display: "inline-block", padding: "12px 28px", marginBottom: 20,
            border: `3px solid ${C.orange}`, borderRadius: "50%",
            transform: "rotate(-6deg)",
            boxShadow: `inset 0 0 0 2px ${C.orange}40`,
          }}>
            <span style={{ fontSize: 40 }}>🎂</span>
          </div>

          <h1 style={{
            fontFamily: FONT, fontSize: "clamp(26px, 8vw, 38px)",
            color: C.ink, margin: "0 0 2px 0",
            textShadow: `2px 2px 0 ${C.mustard}60`,
          }}>
            촛불 끄셈 ㅋㅋ
          </h1>
          <p style={{ fontFamily: FONT, fontSize: "clamp(13px, 3.5vw, 16px)", color: C.faded, margin: "0 0 28px 0" }}>
            생일 케이크 만들어서 보내기 ~
          </p>

          <HandBox color={C.brown}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={warmLabel}>🎉 이름</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="생일인 사람 이름" maxLength={20} style={warmInput} />
              </div>
              <div>
                <label style={warmLabel}>🕯️ 나이 (초 개수가 됨 ㅋ)</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="나이 입력" min={1} max={120} style={warmInput} />
              </div>
              <div>
                <label style={warmLabel}>💌 비밀 메시지 (선택)</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="촛불 끄면 보이는 한마디" maxLength={100} rows={2} style={{ ...warmInput, resize: "none", height: "auto" }} />
              </div>
              <button onClick={() => { if (name.trim() && age) setStep(1); }} disabled={!name.trim() || !age}
                style={{ ...warmBtn, opacity: !name.trim() || !age ? 0.4 : 1, cursor: !name.trim() || !age ? "not-allowed" : "pointer" }}>
                🔥 케이크 만들기
              </button>
            </div>
          </HandBox>
          {/* Ad - Create page bottom */}
          <AdBanner slot="1111111111" style={{ marginTop: 20 }} />
        </div>
      </div>
    );
  }

  // Preview
  const ageNum = parseInt(age);
  const theme = getCakeTheme(ageNum);
  return (
    <div style={{ ...pageStyle, background: C.paper }}>
      <PaperGrain />
      <div style={{ zIndex: 1, textAlign: "center" }}>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.faded, margin: "0 0 4px 0" }}>미리보기 👀</p>
        <div style={{
          display: "inline-block", padding: "4px 16px", marginBottom: 18,
          background: `${theme.accent}20`, border: `2px dashed ${theme.accent}`,
          borderRadius: 20, fontFamily: FONT, fontSize: 14, color: theme.accent,
        }}>
          {theme.label}
        </div>
        <WarmCake age={ageNum} name={name} candlesLit={true} tiltX={0} blowIntensity={0} />
        <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => setStep(0)} style={{ ...warmBtn, background: C.faded, flex: "1 1 130px" }}>← 다시 만들기</button>
          <button onClick={handleShare} style={{ ...warmBtn, flex: "1 1 130px" }}>🔗 링크 복사해서 보내기</button>
        </div>
        {/* Ad - Preview page */}
        <AdBanner slot="2222222222" style={{ marginTop: 20 }} />
      </div>
    </div>
  );
}

// ============================================================
// VIEW PAGE
// ============================================================
function ViewPage({ data }) {
  const { n: name, a: age, m: message } = data;
  const [phase, setPhase] = useState("intro");
  const [tiltX, setTiltX] = useState(0);
  const [blowIntensity, setBlowIntensity] = useState(0);
  const [hasGyro, setHasGyro] = useState(false);
  const [roast, setRoast] = useState("");
  const [failCount, setFailCount] = useState(0);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const blowAccRef = useRef(0);
  const animRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const h = (e) => { setHasGyro(true); setTiltX(Math.max(-30, Math.min(30, e.gamma || 0))); };
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {} else window.addEventListener("deviceorientation", h);
    return () => window.removeEventListener("deviceorientation", h);
  }, []);

  const requestGyro = async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try { const p = await DeviceOrientationEvent.requestPermission(); if (p === "granted") window.addEventListener("deviceorientation", (e) => { setHasGyro(true); setTiltX(Math.max(-30, Math.min(30, e.gamma || 0))); }); } catch {}
    }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = 0.3;
      src.connect(an); analyserRef.current = an; return true;
    } catch { return false; }
  };

  const startBlowDetection = useCallback(() => {
    const an = analyserRef.current; if (!an) return;
    const arr = new Uint8Array(an.frequencyBinCount);
    const detect = () => {
      an.getByteFrequencyData(arr);
      let sum = 0; const bins = Math.floor(arr.length * 0.3);
      for (let i = 0; i < bins; i++) sum += arr[i];
      const avg = sum / bins / 255;
      if (avg > 0.35) { blowAccRef.current += avg * 0.08; setBlowIntensity(Math.min(1, blowAccRef.current)); if (blowAccRef.current >= 1) { handleDone(); return; } }
      else { blowAccRef.current = Math.max(0, blowAccRef.current - 0.02); setBlowIntensity(Math.max(0, blowAccRef.current)); if (blowAccRef.current <= 0 && failCount < 3 && Math.random() < 0.005) setFailCount(f => f + 1); }
      animRef.current = requestAnimationFrame(detect);
    };
    detect();
  }, [failCount]);

  const handleDone = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setPhase("done"); setRoast(getRoast(age)); setShowConfetti(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleIntroTap = async () => {
    await requestGyro(); const ok = await startMic();
    setPhase("lit"); if (ok) setTimeout(() => startBlowDetection(), 500);
  };

  // INTRO
  if (phase === "intro") {
    return (
      <div onClick={handleIntroTap} style={{ ...pageStyle, background: C.darkBg, cursor: "pointer" }}>
        <PaperGrain dark />
        <div style={{ animation: "pulse 2.5s ease-in-out infinite", textAlign: "center", zIndex: 1 }}>
          <div style={{ fontSize: "clamp(60px, 18vw, 90px)", marginBottom: 16, filter: "drop-shadow(0 0 25px rgba(255,160,50,0.6))" }}>🎂</div>
          <p style={{ fontFamily: FONT, fontSize: "clamp(20px, 6vw, 30px)", color: C.cream, margin: "0 0 8px 0" }}>
            {name}에게 케이크가 도착했어!
          </p>
          <p style={{ fontFamily: FONT, fontSize: "clamp(14px, 4vw, 18px)", color: C.faded, margin: "0 0 24px 0" }}>
            화면을 터치해서 불을 붙이자 🔥
          </p>
          <div style={{
            display: "inline-block", padding: "10px 24px",
            border: `2px dashed ${C.mustard}`, borderRadius: 24,
            animation: "pulse 1.5s ease-in-out infinite",
          }}>
            <span style={{ fontFamily: FONT, fontSize: 16, color: C.mustard, fontWeight: 700 }}>톡! 터치!</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#554433", marginTop: 20 }}>
            ※ 마이크 권한이 필요해 (후~ 불어서 끄려면)
          </p>
        </div>
      </div>
    );
  }

  // LIT
  if (phase === "lit") {
    const glow = 1 - blowIntensity * 0.7;
    return (
      <div style={{
        ...pageStyle,
        background: `radial-gradient(ellipse at 50% 40%, rgba(200,120,40,${0.12*glow}) 0%, ${C.darkBg} 60%)`,
      }}>
        <PaperGrain dark />
        <div style={{ zIndex: 1, textAlign: "center" }}>
          <WarmCake age={age} name={name} candlesLit={true} tiltX={tiltX} blowIntensity={blowIntensity} />

          <div style={{ marginTop: 28, animation: "fadeIn 1s ease-out 0.5s both" }}>
            <p style={{ fontFamily: FONT, fontSize: "clamp(18px, 5vw, 26px)", color: C.mustard }}>
              소원 빌고... 후~ 불어봐! 🌬️
            </p>
            {hasGyro && <p style={{ fontFamily: FONT, fontSize: 13, color: "#665544", marginTop: 6 }}>📱 폰 기울이면 초가 움직여!</p>}
            {failCount > 0 && blowIntensity < 0.1 && (
              <p style={{ fontFamily: FONT, fontSize: "clamp(14px, 4vw, 18px)", color: C.dustyPink, marginTop: 10, animation: "shake 0.5s ease-out" }}>
                {failCount === 1 && "ㅋㅋ 폐활량 실화?"}
                {failCount === 2 && "좀 더 세게 불어봐 ㅋㅋㅋ"}
                {failCount >= 3 && "혹시 지금 무호흡? 😂"}
              </p>
            )}
          </div>

          {/* Blow gauge - vintage style */}
          <div style={{ marginTop: 18, width: 180, marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ fontFamily: FONT, fontSize: 12, color: "#665544", marginBottom: 4, textAlign: "left" }}>바람 세기 ~</p>
            <div style={{ width: "100%", height: 12, background: "rgba(255,255,255,0.1)", borderRadius: 6, border: `2px solid ${C.brown}40`, overflow: "hidden" }}>
              <div style={{
                width: `${blowIntensity * 100}%`, height: "100%",
                background: blowIntensity > 0.7 ? C.orange : blowIntensity > 0.3 ? C.mustard : C.sage,
                borderRadius: 4, transition: "width 0.1s, background 0.2s",
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DONE
  const theme = getCakeTheme(age);
  return (
    <div style={{ ...pageStyle, background: C.paper, overflow: "hidden" }}>
      <PaperGrain />
      {showConfetti && <WarmConfetti />}
      <Starburst size={150} color={C.mustard} style={{ position: "absolute", top: -20, right: -30 }} />
      <Starburst size={100} color={C.dustyPink} style={{ position: "absolute", bottom: 30, left: -20 }} />

      <div style={{ animation: "bounceIn 0.6s ease-out", textAlign: "center", zIndex: 1, width: "100%", maxWidth: 380 }}>
        <div style={{ fontSize: "clamp(40px, 12vw, 64px)", marginBottom: 8, animation: "tada 1s ease-out" }}>🎉</div>

        {/* Stamp style celebration */}
        <div style={{
          display: "inline-block", padding: "8px 24px", marginBottom: 16,
          border: `3px solid ${C.orange}`, borderRadius: "50%",
          transform: "rotate(-4deg)",
          boxShadow: `inset 0 0 0 2px ${C.orange}40`,
        }}>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(18px, 5vw, 28px)", color: C.orange, margin: 0 }}>
            생일 축하해!
          </h2>
        </div>

        <p style={{ fontFamily: FONT, fontSize: "clamp(20px, 6vw, 32px)", color: C.ink, margin: "0 0 16px 0", fontWeight: 700 }}>
          {name}
        </p>

        <WarmCake age={age} name={name} candlesLit={false} tiltX={tiltX} blowIntensity={0} />

        {/* B급 연기 코멘트 */}
        <p style={{
          fontFamily: FONT, fontSize: "clamp(13px, 3.5vw, 16px)", color: C.faded,
          margin: "8px 0 0 0", animation: "fadeIn 1.5s ease-out",
        }}>
          {age <= 5 ? "💨 후~ 살짝 연기남" :
           age <= 15 ? "💨💨 연기 좀 나네~" :
           age <= 25 ? "💨💨💨 연기 꽤 나는데...?" :
           age <= 40 ? "🌫️ 헉 연기 장난 아닌데;;;" :
           age <= 60 ? "🚨 화재 아닙니다 화재 아닙니다" :
           age <= 80 ? "🧯 119 부를까...?" :
           "☁️ 여기 구름 낀 거 아님?? 케이크에서 나는 거임"}
        </p>

        {/* Roast - postcard style */}
        <HandBox color={C.mustard} style={{ marginTop: 20, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontFamily: FONT, fontSize: "clamp(15px, 4vw, 20px)", color: C.brown, lineHeight: 1.6, margin: 0, wordBreak: "keep-all" }}>
            {roast}
          </p>
        </HandBox>

        {/* Secret message - letter style */}
        {message && (
          <div style={{
            marginTop: 14, maxWidth: 320, marginLeft: "auto", marginRight: "auto",
            background: C.cream, border: `1px solid ${C.faded}`,
            borderRadius: 4, padding: "16px 20px",
            boxShadow: `3px 3px 0 ${C.faded}40`,
            transform: "rotate(0.5deg)",
          }}>
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.faded, margin: "0 0 6px 0" }}>💌 비밀 메시지 ~</p>
            <p style={{ fontFamily: FONT, fontSize: "clamp(16px, 4.5vw, 20px)", color: C.ink, lineHeight: 1.5, margin: 0, wordBreak: "keep-all" }}>
              "{message}"
            </p>
          </div>
        )}

        {/* Ad - Result page */}
        <AdBanner slot="3333333333" style={{ marginTop: 16 }} />

        <button onClick={() => { window.location.hash = ""; window.location.reload(); }}
          style={{ ...warmBtn, marginTop: 12 }}>
          🎂 나도 케이크 보내기
        </button>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const pageStyle = {
  minHeight: "100dvh", display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden",
};

const warmInput = {
  width: "100%", padding: "12px 14px",
  border: `2px solid ${C.brown}50`, borderRadius: 8,
  background: `${C.cream}`,
  color: C.ink, fontFamily: FONT, fontSize: 17,
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const warmLabel = {
  display: "block", fontFamily: FONT, fontSize: 14,
  color: C.brown, marginBottom: 5, textAlign: "left",
};

const warmBtn = {
  padding: "14px 24px", borderRadius: 24,
  border: `2px solid ${C.ink}`,
  background: C.orange, color: C.cream,
  fontFamily: FONT, fontSize: 18, fontWeight: 700,
  cursor: "pointer", width: "100%",
  boxShadow: `3px 3px 0 ${C.ink}`,
  transition: "all 0.1s",
};

// ============================================================
// MAIN
// ============================================================
export default function App() {
  const [viewData, setViewData] = useState(null);
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#cake=")) { const d = decodeData(hash.slice(6)); if (d && d.n && d.a) setViewData(d); }
    const onHash = () => { const h = window.location.hash; if (h.startsWith("#cake=")) { const d = decodeData(h.slice(6)); if (d && d.n && d.a) setViewData(d); } else setViewData(null); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Caveat:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { background: ${C.paper}; overflow-x: hidden; }
        input:focus, textarea:focus { border-color: ${C.orange} !important; }
        input::placeholder, textarea::placeholder { color: ${C.faded}; font-family: ${FONT}; }
        button:active { transform: translate(2px, 2px) !important; box-shadow: 1px 1px 0 ${C.ink} !important; }

        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.9; } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.95); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        @keyframes tada { 0% { transform: scale(1) rotate(0); } 10%, 20% { transform: scale(0.9) rotate(-3deg); } 30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); } 40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); } 100% { transform: scale(1) rotate(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(540deg); opacity: 0; } }
      `}</style>
      {viewData ? <ViewPage data={viewData} /> : <CreatePage />}
    </>
  );
}

// ============================================================
// 🎨 테마 상수 - 색상, 폰트, 공통 스타일
// ============================================================

export const FONT = "'Gaegu', cursive";
export const FONT_EN = "'Caveat', cursive";

export const C = {
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

export const pageStyle = {
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  position: "relative",
  overflow: "hidden",
};

export const warmInput = {
  width: "100%",
  padding: "12px 14px",
  border: `2px solid ${C.brown}50`,
  borderRadius: 8,
  background: C.cream,
  color: C.ink,
  fontFamily: FONT,
  fontSize: 17,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export const warmLabel = {
  display: "block",
  fontFamily: FONT,
  fontSize: 14,
  color: C.brown,
  marginBottom: 5,
  textAlign: "left",
};

export const warmBtn = {
  padding: "14px 24px",
  borderRadius: 24,
  border: `2px solid ${C.ink}`,
  background: C.orange,
  color: C.cream,
  fontFamily: FONT,
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  width: "100%",
  boxShadow: `3px 3px 0 ${C.ink}`,
  transition: "all 0.1s",
};

export const globalStyles = `
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
`;

import { useState, useCallback } from "react";
import { C, FONT } from "../constants/theme";

// ============================================================
// 🎭 셀카 효과 30종 - SVG 오버레이
// ============================================================

// 각 효과는 SVG viewBox="0 0 300 400" 기준으로 얼굴 중앙(150, 180)에 맞춰 그림
const EFFECTS = [
  {
    name: "👑 왕관",
    render: () => (
      <g>
        <polygon points="80,130 95,70 115,110 135,50 150,100 165,50 185,110 205,70 220,130" fill="#FFD700" stroke="#B8860B" strokeWidth="3" />
        {[95,135,165,205].map((x,i) => <circle key={i} cx={x} cy={95+i%2*15} r="6" fill={["#FF4444","#4488FF","#44FF44","#FF4444"][i]} stroke="#333" strokeWidth="1" />)}
      </g>
    ),
  },
  {
    name: "🎩 신사 모자",
    render: () => (
      <g>
        <rect x="95" y="60" width="110" height="80" rx="8" fill="#222" stroke="#444" strokeWidth="2" />
        <ellipse cx="150" cy="140" rx="80" ry="12" fill="#222" stroke="#444" strokeWidth="2" />
        <rect x="100" y="125" width="100" height="8" rx="2" fill="#B8860B" />
      </g>
    ),
  },
  {
    name: "🐱 고양이",
    render: () => (
      <g>
        {/* 귀 */}
        <polygon points="85,140 65,60 120,110" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
        <polygon points="215,140 235,60 180,110" fill="#FFB6C1" stroke="#333" strokeWidth="2" />
        <polygon points="90,130 75,75 115,115" fill="#FF69B4" />
        <polygon points="210,130 225,75 185,115" fill="#FF69B4" />
        {/* 수염 */}
        <line x1="60" y1="210" x2="120" y2="205" stroke="#333" strokeWidth="2" />
        <line x1="55" y1="220" x2="120" y2="215" stroke="#333" strokeWidth="2" />
        <line x1="60" y1="230" x2="120" y2="225" stroke="#333" strokeWidth="2" />
        <line x1="240" y1="210" x2="180" y2="205" stroke="#333" strokeWidth="2" />
        <line x1="245" y1="220" x2="180" y2="215" stroke="#333" strokeWidth="2" />
        <line x1="240" y1="230" x2="180" y2="225" stroke="#333" strokeWidth="2" />
        {/* 코 */}
        <ellipse cx="150" cy="210" rx="10" ry="7" fill="#FF69B4" stroke="#333" strokeWidth="1.5" />
      </g>
    ),
  },
  {
    name: "🐶 강아지",
    render: () => (
      <g>
        {/* 귀 */}
        <ellipse cx="80" cy="130" rx="35" ry="55" fill="#8B4513" stroke="#333" strokeWidth="2" transform="rotate(-15,80,130)" />
        <ellipse cx="220" cy="130" rx="35" ry="55" fill="#8B4513" stroke="#333" strokeWidth="2" transform="rotate(15,220,130)" />
        {/* 코 */}
        <ellipse cx="150" cy="215" rx="18" ry="13" fill="#222" />
        <ellipse cx="150" cy="212" rx="6" ry="3" fill="#555" />
        {/* 혀 */}
        <ellipse cx="150" cy="245" rx="14" ry="20" fill="#FF6B8A" stroke="#333" strokeWidth="1.5" />
        <line x1="150" y1="230" x2="150" y2="255" stroke="#E55A7B" strokeWidth="1.5" />
      </g>
    ),
  },
  {
    name: "🐰 토끼",
    render: () => (
      <g>
        <ellipse cx="120" cy="50" rx="20" ry="60" fill="#FFF" stroke="#333" strokeWidth="2" />
        <ellipse cx="120" cy="45" rx="12" ry="45" fill="#FFB6C1" />
        <ellipse cx="180" cy="50" rx="20" ry="60" fill="#FFF" stroke="#333" strokeWidth="2" />
        <ellipse cx="180" cy="45" rx="12" ry="45" fill="#FFB6C1" />
        <ellipse cx="150" cy="215" rx="10" ry="7" fill="#FFB6C1" stroke="#333" strokeWidth="1.5" />
      </g>
    ),
  },
  {
    name: "🕶️ 선글라스",
    render: () => (
      <g>
        <rect x="75" y="170" width="60" height="40" rx="8" fill="#111" stroke="#333" strokeWidth="3" />
        <rect x="165" y="170" width="60" height="40" rx="8" fill="#111" stroke="#333" strokeWidth="3" />
        <line x1="135" y1="190" x2="165" y2="190" stroke="#333" strokeWidth="3" />
        <line x1="75" y1="185" x2="55" y2="178" stroke="#333" strokeWidth="3" />
        <line x1="225" y1="185" x2="245" y2="178" stroke="#333" strokeWidth="3" />
        <rect x="80" y="175" width="50" height="10" rx="3" fill="rgba(100,200,255,0.3)" />
        <rect x="170" y="175" width="50" height="10" rx="3" fill="rgba(100,200,255,0.3)" />
      </g>
    ),
  },
  {
    name: "🤡 삐에로",
    render: () => (
      <g>
        {/* 빨간코 */}
        <circle cx="150" cy="210" r="18" fill="#FF0000" stroke="#CC0000" strokeWidth="2" />
        <circle cx="145" cy="205" r="5" fill="#FF6666" opacity="0.6" />
        {/* 무지개 가발 */}
        {[60,85,110,135,160,185,210,240].map((x,i) => (
          <ellipse key={i} cx={x} cy={120} rx="20" ry="30" fill={["#FF0000","#FF8800","#FFFF00","#00CC00","#0088FF","#8800FF","#FF0088","#FF4400"][i]} opacity="0.85" />
        ))}
      </g>
    ),
  },
  {
    name: "🎭 가면무도회",
    render: () => (
      <g>
        <path d="M70,180 Q80,155 120,160 Q150,165 180,160 Q220,155 230,180 Q220,210 190,200 Q170,195 150,200 Q130,195 110,200 Q80,210 70,180 Z"
          fill="#8B0000" stroke="#FFD700" strokeWidth="3" />
        {/* 눈구멍 */}
        <ellipse cx="110" cy="185" rx="18" ry="14" fill="#000" />
        <ellipse cx="190" cy="185" rx="18" ry="14" fill="#000" />
        {/* 장식 깃털 */}
        <path d="M230,170 Q260,130 250,80 Q245,100 235,110 Q240,90 230,70" fill="none" stroke="#FFD700" strokeWidth="2.5" />
        <path d="M228,172 Q270,140 255,85" fill="none" stroke="#8B0000" strokeWidth="2" />
      </g>
    ),
  },
  {
    name: "🤠 카우보이",
    render: () => (
      <g>
        <ellipse cx="150" cy="135" rx="95" ry="15" fill="#8B6914" stroke="#5C4A10" strokeWidth="2" />
        <path d="M85,135 Q90,80 120,70 Q150,60 180,70 Q210,80 215,135" fill="#A0781E" stroke="#5C4A10" strokeWidth="2" />
        <path d="M55,140 Q80,150 150,145 Q220,150 245,140 Q230,125 150,130 Q70,125 55,140 Z" fill="#8B6914" stroke="#5C4A10" strokeWidth="2" />
        <rect x="110" y="115" width="80" height="8" rx="2" fill="#5C4A10" />
      </g>
    ),
  },
  {
    name: "🎅 산타",
    render: () => (
      <g>
        {/* 모자 */}
        <path d="M80,145 Q85,80 150,50 Q215,80 220,145" fill="#CC0000" stroke="#880000" strokeWidth="2" />
        <ellipse cx="150" cy="145" rx="80" ry="15" fill="#FFF" stroke="#DDD" strokeWidth="1" />
        <circle cx="180" cy="55" r="14" fill="#FFF" stroke="#DDD" strokeWidth="1" />
        {/* 수염 */}
        <path d="M85,235 Q100,280 150,290 Q200,280 215,235 Q200,260 150,265 Q100,260 85,235 Z" fill="#FFF" stroke="#EEE" strokeWidth="1" />
        <path d="M80,230 Q75,255 85,260 Q80,245 85,235" fill="#FFF" />
        <path d="M220,230 Q225,255 215,260 Q220,245 215,235" fill="#FFF" />
      </g>
    ),
  },
  {
    name: "🦄 유니콘",
    render: () => (
      <g>
        {/* 뿔 */}
        <polygon points="150,30 140,120 160,120" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
        <line x1="143" y1="60" x2="157" y2="60" stroke="#FFA500" strokeWidth="2" />
        <line x1="144" y1="80" x2="156" y2="80" stroke="#FF69B4" strokeWidth="2" />
        <line x1="145" y1="100" x2="155" y2="100" stroke="#87CEEB" strokeWidth="2" />
        {/* 귀 */}
        <polygon points="95,140 80,85 120,120" fill="#FFB6C1" stroke="#333" strokeWidth="1.5" />
        <polygon points="205,140 220,85 180,120" fill="#FFB6C1" stroke="#333" strokeWidth="1.5" />
        {/* 꽃 */}
        {[{x:90,y:130},{x:130,y:115},{x:170,y:115},{x:210,y:130}].map((p,i) => (
          <circle key={i} cx={p.x} cy={p.y} r="8" fill={["#FF69B4","#87CEEB","#DDA0DD","#98FB98"][i]} stroke="#333" strokeWidth="1" />
        ))}
      </g>
    ),
  },
  {
    name: "👻 유령",
    render: () => (
      <g>
        <path d="M70,80 Q70,30 150,25 Q230,30 230,80 L230,300 Q215,280 200,300 Q185,280 170,300 Q155,280 140,300 Q125,280 110,300 Q95,280 80,300 L70,300 Z"
          fill="rgba(255,255,255,0.7)" stroke="#DDD" strokeWidth="2" />
        <ellipse cx="120" cy="160" rx="20" ry="25" fill="#111" />
        <ellipse cx="180" cy="160" rx="20" ry="25" fill="#111" />
        <ellipse cx="150" cy="220" rx="20" ry="28" fill="#111" />
      </g>
    ),
  },
  {
    name: "🐸 개구리",
    render: () => (
      <g>
        {/* 눈 */}
        <circle cx="110" cy="140" r="30" fill="#22AA22" stroke="#116611" strokeWidth="3" />
        <circle cx="190" cy="140" r="30" fill="#22AA22" stroke="#116611" strokeWidth="3" />
        <circle cx="110" cy="135" r="16" fill="#FFF" stroke="#333" strokeWidth="2" />
        <circle cx="190" cy="135" r="16" fill="#FFF" stroke="#333" strokeWidth="2" />
        <circle cx="112" cy="133" r="8" fill="#111" />
        <circle cx="192" cy="133" r="8" fill="#111" />
        {/* 입 */}
        <path d="M90,240 Q120,265 150,260 Q180,265 210,240" fill="none" stroke="#116611" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },
  {
    name: "🌸 꽃 왕관",
    render: () => (
      <g>
        {[65,95,125,150,175,205,235].map((x,i) => {
          const colors = ["#FF69B4","#FFB347","#FF6B8A","#DDA0DD","#98FB98","#87CEEB","#FFD700"];
          return (
            <g key={i}>
              {[0,72,144,216,288].map((a,j) => (
                <ellipse key={j} cx={x + Math.cos(a*Math.PI/180)*8} cy={120+Math.sin(a*Math.PI/180)*8 + (i%2)*8}
                  rx="7" ry="10" fill={colors[i]} opacity="0.85" transform={`rotate(${a},${x + Math.cos(a*Math.PI/180)*8},${120+Math.sin(a*Math.PI/180)*8 + (i%2)*8})`} />
              ))}
              <circle cx={x} cy={120 + (i%2)*8} r="5" fill="#FFD700" />
            </g>
          );
        })}
        {/* 줄기 */}
        <path d="M60,130 Q150,145 240,130" fill="none" stroke="#228B22" strokeWidth="2" />
      </g>
    ),
  },
  {
    name: "🦊 여우",
    render: () => (
      <g>
        <polygon points="85,145 55,55 130,110" fill="#FF8C00" stroke="#333" strokeWidth="2" />
        <polygon points="215,145 245,55 170,110" fill="#FF8C00" stroke="#333" strokeWidth="2" />
        <polygon points="90,135 70,70 120,115" fill="#FFF" />
        <polygon points="210,135 230,70 180,115" fill="#FFF" />
        <ellipse cx="150" cy="212" rx="12" ry="8" fill="#222" />
      </g>
    ),
  },
  {
    name: "😎 별 선글라스",
    render: () => (
      <g>
        {/* 왼쪽 별 */}
        <polygon points="105,185 112,170 120,178 135,175 125,188 130,202 118,195 105,200 110,190 98,182"
          fill="#FF1493" stroke="#C4106E" strokeWidth="2" />
        {/* 오른쪽 별 */}
        <polygon points="195,185 202,170 210,178 225,175 215,188 220,202 208,195 195,200 200,190 188,182"
          fill="#FF1493" stroke="#C4106E" strokeWidth="2" />
        <line x1="130" y1="185" x2="170" y2="185" stroke="#C4106E" strokeWidth="3" />
        <line x1="85" y1="180" x2="98" y2="182" stroke="#C4106E" strokeWidth="3" />
        <line x1="215" y1="180" x2="228" y2="178" stroke="#C4106E" strokeWidth="3" />
      </g>
    ),
  },
  {
    name: "👽 외계인",
    render: () => (
      <g>
        <ellipse cx="105" cy="175" rx="35" ry="20" fill="#111" transform="rotate(-10,105,175)" />
        <ellipse cx="195" cy="175" rx="35" ry="20" fill="#111" transform="rotate(10,195,175)" />
        <ellipse cx="105" cy="173" rx="30" ry="16" fill="#44FF44" opacity="0.4" transform="rotate(-10,105,173)" />
        <ellipse cx="195" cy="173" rx="30" ry="16" fill="#44FF44" opacity="0.4" transform="rotate(10,195,173)" />
        {/* 안테나 */}
        <line x1="130" y1="130" x2="120" y2="70" stroke="#888" strokeWidth="2" />
        <circle cx="120" cy="65" r="6" fill="#44FF44" opacity="0.8" />
        <line x1="170" y1="130" x2="180" y2="70" stroke="#888" strokeWidth="2" />
        <circle cx="180" cy="65" r="6" fill="#44FF44" opacity="0.8" />
      </g>
    ),
  },
  {
    name: "🐼 판다",
    render: () => (
      <g>
        {/* 눈 패치 */}
        <ellipse cx="110" cy="185" rx="30" ry="25" fill="#222" transform="rotate(-10,110,185)" />
        <ellipse cx="190" cy="185" rx="30" ry="25" fill="#222" transform="rotate(10,190,185)" />
        <circle cx="112" cy="182" r="8" fill="#FFF" />
        <circle cx="188" cy="182" r="8" fill="#FFF" />
        <circle cx="113" cy="181" r="4" fill="#111" />
        <circle cx="187" cy="181" r="4" fill="#111" />
        {/* 귀 */}
        <circle cx="85" cy="125" r="22" fill="#222" />
        <circle cx="215" cy="125" r="22" fill="#222" />
        {/* 코 */}
        <ellipse cx="150" cy="215" rx="10" ry="7" fill="#222" />
      </g>
    ),
  },
  {
    name: "🦁 사자",
    render: () => (
      <g>
        {/* 갈기 */}
        {Array.from({length: 16}).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const x = 150 + Math.cos(angle) * 95;
          const y = 175 + Math.sin(angle) * 95;
          return <ellipse key={i} cx={x} cy={y} rx="30" ry="18"
            fill={i%2===0 ? "#CD853F" : "#DEB887"} stroke="#8B6914" strokeWidth="1"
            transform={`rotate(${i*22.5},${x},${y})`} />;
        })}
        {/* 코 */}
        <polygon points="150,208 140,220 160,220" fill="#8B4513" />
      </g>
    ),
  },
  {
    name: "🐷 돼지",
    render: () => (
      <g>
        {/* 귀 */}
        <ellipse cx="90" cy="130" rx="28" ry="22" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" transform="rotate(-20,90,130)" />
        <ellipse cx="210" cy="130" rx="28" ry="22" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" transform="rotate(20,210,130)" />
        {/* 코 */}
        <ellipse cx="150" cy="215" rx="24" ry="17" fill="#FF69B4" stroke="#E55A7B" strokeWidth="2" />
        <ellipse cx="142" cy="215" rx="5" ry="6" fill="#E55A7B" />
        <ellipse cx="158" cy="215" rx="5" ry="6" fill="#E55A7B" />
      </g>
    ),
  },
  {
    name: "🎪 파티 모자",
    render: () => (
      <g>
        <polygon points="150,30 100,145 200,145" fill="#FF6B8A" stroke="#333" strokeWidth="2" />
        <circle cx="150" cy="25" r="12" fill="#FFD700" />
        {/* 줄무늬 */}
        <line x1="130" y1="80" x2="145" y2="80" stroke="#FFD700" strokeWidth="5" />
        <line x1="122" y1="100" x2="150" y2="100" stroke="#87CEEB" strokeWidth="5" />
        <line x1="114" y1="120" x2="155" y2="120" stroke="#98FB98" strokeWidth="5" />
        <ellipse cx="150" cy="145" rx="55" ry="10" fill="none" stroke="#333" strokeWidth="2" />
      </g>
    ),
  },
  {
    name: "💀 해골",
    render: () => (
      <g>
        {/* 눈 */}
        <ellipse cx="115" cy="182" rx="22" ry="25" fill="#111" />
        <ellipse cx="185" cy="182" rx="22" ry="25" fill="#111" />
        {/* 코 */}
        <polygon points="150,210 142,225 158,225" fill="#111" />
        {/* 이빨 */}
        {[120,135,150,165,180].map((x,i) => (
          <rect key={i} x={x-5} y="242" width="10" height="14" rx="2" fill="#FFF" stroke="#CCC" strokeWidth="1" />
        ))}
        <line x1="110" y1="248" x2="190" y2="248" stroke="#111" strokeWidth="1.5" />
      </g>
    ),
  },
  {
    name: "🤖 로봇",
    render: () => (
      <g>
        {/* 안테나 */}
        <line x1="150" y1="110" x2="150" y2="70" stroke="#888" strokeWidth="3" />
        <circle cx="150" cy="65" r="8" fill="#FF4444" />
        {/* 눈 */}
        <rect x="95" y="170" width="40" height="30" rx="4" fill="#00FFFF" stroke="#555" strokeWidth="3" />
        <rect x="165" y="170" width="40" height="30" rx="4" fill="#00FFFF" stroke="#555" strokeWidth="3" />
        <rect x="105" y="180" width="8" height="8" fill="#004444" />
        <rect x="120" y="180" width="8" height="8" fill="#004444" />
        <rect x="175" y="180" width="8" height="8" fill="#004444" />
        <rect x="190" y="180" width="8" height="8" fill="#004444" />
        {/* 입 */}
        <rect x="115" y="235" width="70" height="15" rx="3" fill="#555" stroke="#444" strokeWidth="2" />
        {[125,140,155,170].map((x,i) => <line key={i} x1={x} y1="237" x2={x} y2="248" stroke="#333" strokeWidth="1.5" />)}
      </g>
    ),
  },
  {
    name: "🧙 마법사",
    render: () => (
      <g>
        <polygon points="150,10 85,145 215,145" fill="#2C1B6E" stroke="#1A1040" strokeWidth="2" />
        <ellipse cx="150" cy="145" rx="70" ry="12" fill="#2C1B6E" stroke="#1A1040" strokeWidth="2" />
        {/* 별/달 장식 */}
        <polygon points="130,60 133,70 143,70 135,76 138,86 130,80 122,86 125,76 117,70 127,70" fill="#FFD700" />
        <path d="M165,80 Q175,65 170,90 Q185,78 165,80 Z" fill="#C0C0C0" />
        <polygon points="145,105 147,112 155,112 149,116 151,123 145,119 139,123 141,116 135,112 143,112" fill="#FFD700" />
      </g>
    ),
  },
  {
    name: "💕 하트 선글라스",
    render: () => (
      <g>
        <path d="M105,175 Q105,160 90,160 Q70,160 70,180 Q70,200 105,215 Q140,200 140,180 Q140,160 120,160 Q105,160 105,175 Z"
          fill="#FF1493" stroke="#C4106E" strokeWidth="2" />
        <path d="M195,175 Q195,160 180,160 Q160,160 160,180 Q160,200 195,215 Q230,200 230,180 Q230,160 210,160 Q195,160 195,175 Z"
          fill="#FF1493" stroke="#C4106E" strokeWidth="2" />
        <line x1="140" y1="185" x2="160" y2="185" stroke="#C4106E" strokeWidth="3" />
        <line x1="70" y1="178" x2="50" y2="172" stroke="#C4106E" strokeWidth="3" />
        <line x1="230" y1="178" x2="250" y2="172" stroke="#C4106E" strokeWidth="3" />
        {/* 반사 */}
        <ellipse cx="90" cy="175" rx="8" ry="5" fill="rgba(255,255,255,0.3)" transform="rotate(-20,90,175)" />
        <ellipse cx="185" cy="175" rx="8" ry="5" fill="rgba(255,255,255,0.3)" transform="rotate(-20,185,175)" />
      </g>
    ),
  },
  {
    name: "🐮 젖소",
    render: () => (
      <g>
        {/* 뿔 */}
        <path d="M95,135 Q80,100 70,80" fill="none" stroke="#F5DEB3" strokeWidth="10" strokeLinecap="round" />
        <path d="M205,135 Q220,100 230,80" fill="none" stroke="#F5DEB3" strokeWidth="10" strokeLinecap="round" />
        {/* 얼룩 */}
        <ellipse cx="120" cy="160" rx="25" ry="18" fill="#333" opacity="0.6" transform="rotate(-10,120,160)" />
        <ellipse cx="195" cy="175" rx="20" ry="22" fill="#333" opacity="0.6" transform="rotate(15,195,175)" />
        <ellipse cx="155" cy="210" rx="18" ry="12" fill="#333" opacity="0.6" />
        {/* 코 */}
        <ellipse cx="150" cy="230" rx="28" ry="18" fill="#FFB6C1" stroke="#E55A7B" strokeWidth="2" />
        <ellipse cx="140" cy="230" rx="5" ry="6" fill="#E55A7B" />
        <ellipse cx="160" cy="230" rx="5" ry="6" fill="#E55A7B" />
      </g>
    ),
  },
  {
    name: "🎀 리본",
    render: () => (
      <g>
        <path d="M150,120 Q110,90 80,105 Q95,120 150,120" fill="#FF69B4" stroke="#E55A7B" strokeWidth="2" />
        <path d="M150,120 Q190,90 220,105 Q205,120 150,120" fill="#FF69B4" stroke="#E55A7B" strokeWidth="2" />
        <circle cx="150" cy="120" r="10" fill="#FF1493" stroke="#C4106E" strokeWidth="2" />
        <path d="M145,130 Q140,160 135,175" fill="none" stroke="#FF69B4" strokeWidth="5" strokeLinecap="round" />
        <path d="M155,130 Q160,160 165,175" fill="none" stroke="#FF69B4" strokeWidth="5" strokeLinecap="round" />
      </g>
    ),
  },
  {
    name: "🎃 호박",
    render: () => (
      <g>
        {/* 호박 얼굴 오버레이 */}
        <polygon points="100,175 110,165 125,175" fill="#FFD700" />
        <polygon points="200,175 190,165 175,175" fill="#FFD700" />
        {/* 입 */}
        <path d="M110,230 L120,222 L130,235 L140,218 L150,238 L160,218 L170,235 L180,222 L190,230"
          fill="none" stroke="#FFD700" strokeWidth="3" strokeLinejoin="round" />
        {/* 꼭지 */}
        <rect x="145" y="110" width="10" height="20" rx="3" fill="#228B22" />
        <path d="M150,115 Q170,100 175,110" fill="none" stroke="#228B22" strokeWidth="2" />
      </g>
    ),
  },
  {
    name: "🧢 힙합 캡",
    render: () => (
      <g>
        <path d="M75,155 Q80,110 150,105 Q220,110 225,155" fill="#222" stroke="#111" strokeWidth="2" />
        <ellipse cx="150" cy="155" rx="80" ry="12" fill="#222" stroke="#111" strokeWidth="2" />
        {/* 챙 */}
        <path d="M75,155 Q60,158 50,165 Q100,175 155,168 Q110,165 75,155 Z" fill="#333" stroke="#111" strokeWidth="1.5" />
        {/* 로고 */}
        <text x="150" y="140" textAnchor="middle" style={{fontSize: 20, fontWeight: 700}} fill="#FFD700">B</text>
      </g>
    ),
  },
  {
    name: "👓 뿔테 안경",
    render: () => (
      <g>
        <circle cx="110" cy="185" r="28" fill="none" stroke="#222" strokeWidth="5" />
        <circle cx="190" cy="185" r="28" fill="none" stroke="#222" strokeWidth="5" />
        <line x1="138" y1="185" x2="162" y2="185" stroke="#222" strokeWidth="4" />
        <line x1="82" y1="180" x2="60" y2="175" stroke="#222" strokeWidth="4" />
        <line x1="218" y1="180" x2="240" y2="175" stroke="#222" strokeWidth="4" />
        {/* 렌즈 반사 */}
        <path d="M95,172 Q100,168 108,172" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <path d="M175,172 Q180,168 188,172" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      </g>
    ),
  },
];

export function FaceEffects({ active, faceBox }) {
  const [effectIdx, setEffectIdx] = useState(() => Math.floor(Math.random() * EFFECTS.length));

  const randomize = useCallback(() => {
    setEffectIdx((prev) => {
      let next;
      do { next = Math.floor(Math.random() * EFFECTS.length); } while (next === prev);
      return next;
    });
  }, []);

  if (!active) return null;

  const effect = EFFECTS[effectIdx];

  // SVG viewBox 기준 얼굴 중심 / 비율
  const SVG_FACE_CX = 150;  // viewBox 내 얼굴 중심 X
  const SVG_FACE_CY = 170;  // viewBox 내 얼굴 중심 Y (눈 위치)
  const SVG_FACE_W = 120;   // viewBox 내 얼굴 너비
  const SVG_VB_W = 300;
  const SVG_VB_H = 400;

  let svgStyle;

  if (faceBox) {
    // 얼굴 감지됨 → 동적 위치/크기
    const faceCX = (faceBox.x + faceBox.w / 2) * 100; // %
    const faceCY = (faceBox.y + faceBox.h / 2) * 100; // %

    // SVG 전체 너비 = 감지된 얼굴 너비 / (SVG 얼굴 비율)
    const svgWidthPct = (faceBox.w / (SVG_FACE_W / SVG_VB_W)) * 100;
    const svgHeightPct = svgWidthPct * (SVG_VB_H / SVG_VB_W);

    // SVG 내 얼굴 중심이 감지된 얼굴 중심과 일치하도록 오프셋
    const offsetXPct = (SVG_FACE_CX / SVG_VB_W) * svgWidthPct;
    const offsetYPct = (SVG_FACE_CY / SVG_VB_H) * svgHeightPct;

    svgStyle = {
      position: "absolute",
      left: `calc(${faceCX}% - ${offsetXPct}%)`,
      top: `calc(${faceCY}% - ${offsetYPct}%)`,
      width: `${svgWidthPct}%`,
      height: `${svgHeightPct}%`,
      zIndex: 1,
      pointerEvents: "none",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
      transition: "left 0.08s linear, top 0.08s linear, width 0.08s linear",
    };
  } else {
    // 얼굴 감지 미지원 → 고정 위치 (fallback)
    svgStyle = {
      position: "absolute",
      top: "5%",
      left: "50%",
      transform: "translateX(-50%) scaleX(-1)",
      width: "min(70vw, 300px)",
      height: "auto",
      zIndex: 1,
      pointerEvents: "none",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
    };
  }

  return (
    <>
      {/* 효과 오버레이 */}
      <svg viewBox="0 0 300 400" style={svgStyle}>
        {effect.render()}
      </svg>

      {/* 랜덤 버튼 */}
      <button
        onClick={randomize}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 2,
          padding: "10px 16px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          border: `2px solid ${C.mustard}`,
          borderRadius: 24,
          color: C.cream,
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        🎲 {effect.name}
      </button>
    </>
  );
}

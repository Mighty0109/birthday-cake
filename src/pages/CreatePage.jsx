import { useState } from "react";
import { C, FONT, pageStyle, warmInput, warmLabel, warmBtn } from "../constants/theme";
import { encodeData } from "../utils/codec";
import { getCakeTheme } from "../utils/cakeTheme";
import { PaperGrain } from "../components/PaperGrain";
import { HandBox } from "../components/HandBox";
import { Starburst } from "../components/Starburst";
import { WarmCake } from "../components/WarmCake";
import { AdBanner } from "../components/AdBanner";

// ============================================================
// ✏️ 케이크 만들기 페이지
// ============================================================

export function CreatePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);

  const handleShare = () => {
    const data = encodeData({ n: name.trim(), a: parseInt(age), m: message.trim() });
    const url = `${window.location.origin}${window.location.pathname}#cake=${data}`;
    if (navigator.clipboard)
      navigator.clipboard.writeText(url).then(() => alert("링크 복사 완료!\n카톡이나 DM으로 보내면 돼~"));
    else prompt("링크를 복사해:", url);
  };

  // 입력 폼
  if (step === 0) {
    return (
      <div style={{ ...pageStyle, background: C.paper }}>
        <PaperGrain />
        <Starburst size={120} color={C.mustard} style={{ position: "absolute", top: 20, right: -20 }} />
        <Starburst size={80} color={C.dustyPink} style={{ position: "absolute", bottom: 40, left: -10 }} />

        <div style={{ animation: "fadeIn 0.6s ease-out", textAlign: "center", width: "100%", maxWidth: 360, zIndex: 1 }}>
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
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="생일인 사람 이름" maxLength={20} style={warmInput} />
              </div>
              <div>
                <label style={warmLabel}>🕯️ 나이 (초 개수가 됨 ㅋ)</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="나이 입력" min={1} max={120} style={warmInput} />
              </div>
              <div>
                <label style={warmLabel}>💌 비밀 메시지 (선택)</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="촛불 끄면 보이는 한마디" maxLength={100} rows={2} style={{ ...warmInput, resize: "none", height: "auto" }} />
              </div>
              <button
                onClick={() => { if (name.trim() && age) setStep(1); }}
                disabled={!name.trim() || !age}
                style={{ ...warmBtn, opacity: !name.trim() || !age ? 0.4 : 1, cursor: !name.trim() || !age ? "not-allowed" : "pointer" }}
              >
                🔥 케이크 만들기
              </button>
            </div>
          </HandBox>
          <AdBanner slot="1111111111" style={{ marginTop: 20 }} />
        </div>
      </div>
    );
  }

  // 미리보기
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
        <AdBanner slot="2222222222" style={{ marginTop: 20 }} />
      </div>
    </div>
  );
}

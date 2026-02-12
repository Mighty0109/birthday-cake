import { useState, useCallback } from "react";
import { C, FONT, pageStyle, warmBtn } from "../constants/theme";
import { getRoast, getSmokeComment } from "../constants/roasts";
import { useGyroscope } from "../hooks/useGyroscope";
import { useMicrophone } from "../hooks/useMicrophone";
import { PaperGrain } from "../components/PaperGrain";
import { HandBox } from "../components/HandBox";
import { Starburst } from "../components/Starburst";
import { WarmCake } from "../components/WarmCake";
import { WarmConfetti } from "../components/WarmConfetti";
import { AdBanner } from "../components/AdBanner";

// ============================================================
// 👀 케이크 보기 페이지 (Intro → Lit → Done)
// 카메라 제거 버전 — 마이크 + 자이로만 사용
// ============================================================

export function ViewPage({ data }) {
  const { n: name, a: age, m: message } = data;
  const [phase, setPhase] = useState("intro");
  const [roast, setRoast] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justBlownOut, setJustBlownOut] = useState(false);

  const { tiltX, requestPermission } = useGyroscope();

  const handleDone = useCallback(() => {
    setPhase("done");
    setJustBlownOut(true);
    setRoast(getRoast(age));
    setShowConfetti(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setTimeout(() => setShowConfetti(false), 5000);
  }, [age]);

  const mic = useMicrophone({
    onDone: handleDone,
    failCount,
    setFailCount,
  });

  const handleIntroTap = async () => {
    try { await requestPermission(); } catch {}
    let micOk = false;
    try {
      micOk = await mic.start();
    } catch {}
    setPhase("lit");
    if (micOk) setTimeout(() => mic.startDetection(), 500);
  };

  // ─── INTRO ───
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
            <span style={{ fontFamily: FONT, fontSize: 16, color: C.mustard, fontWeight: 700 }}>톡! 터치하기</span>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>
      </div>
    );
  }

  // ─── LIT ───
  if (phase === "lit") {
    return (
      <div style={{ ...pageStyle, background: C.darkBg, justifyContent: "center" }}>
        <PaperGrain dark />

        {/* 메시지 */}
        {message && (
          <div style={{
            position: "absolute", top: "clamp(20px, 5vh, 50px)", left: 20, right: 20,
            textAlign: "center", zIndex: 2,
          }}>
            <HandBox>
              <p style={{ fontFamily: FONT, fontSize: "clamp(15px, 4vw, 20px)", color: C.ink, margin: 0, lineHeight: 1.5 }}>
                💌 {message}
              </p>
            </HandBox>
          </div>
        )}

        {/* 케이크 */}
        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <WarmCake
            age={age} name={name} candlesLit={true}
            tiltX={tiltX} blowIntensity={mic.blowIntensity}
          />
        </div>

        {/* 불기 안내 */}
        <div style={{
          position: "absolute", bottom: "clamp(20px, 5vh, 50px)", left: 20, right: 20,
          textAlign: "center", zIndex: 2,
        }}>
          <p style={{
            fontFamily: FONT, fontSize: "clamp(16px, 4.5vw, 22px)", color: C.cream,
            animation: "pulse 2s ease-in-out infinite",
          }}>
            {mic.blowIntensity > 0.3 ? "💨 후우우~ 세게!!" : "후~ 불어서 촛불을 꺼봐! 🌬️"}
          </p>
          {failCount > 0 && (
            <p style={{ fontFamily: FONT, fontSize: 14, color: C.faded, marginTop: 4 }}>
              {failCount >= 3 ? "폐활량 실화?? 좀만 더!!" : failCount >= 2 ? "아직 멀었어~ 더 세게!" : "조금 더 세게 불어봐!"}
            </p>
          )}

          {/* 마이크 안될 때 수동 버튼 */}
          <button
            onClick={handleDone}
            style={{
              ...warmBtn, marginTop: 12, background: "transparent",
              border: `1px dashed ${C.faded}`, color: C.faded, fontSize: 13, padding: "6px 16px",
            }}
          >
            🕯️ 터치로 끄기
          </button>
        </div>

        {showConfetti && <WarmConfetti />}
      </div>
    );
  }

  // ─── DONE ───
  return (
    <div style={{ ...pageStyle, background: C.warmBg, justifyContent: "center" }}>
      <PaperGrain />
      {showConfetti && <WarmConfetti />}

      <div style={{ textAlign: "center", zIndex: 1, padding: "0 20px" }}>
        {/* 축하 메시지 */}
        <Starburst size={80} color={C.mustard} style={{ position: "absolute", top: -10, right: -10 }} />
        <p style={{
          fontFamily: FONT, fontSize: "clamp(28px, 8vw, 42px)", color: C.orange,
          margin: "0 0 8px 0", fontWeight: 700, animation: "fadeIn 0.8s ease-out",
        }}>
          🎉 생일 축하해, {name}!
        </p>

        {/* 디스 멘트 */}
        {roast && (
          <p style={{
            fontFamily: FONT, fontSize: "clamp(14px, 3.5vw, 18px)", color: C.ink,
            margin: "0 0 16px 0", animation: "fadeIn 1.2s ease-out",
          }}>
            {roast}
          </p>
        )}

        {/* 케이크 (초 꺼진 상태 + 연기) */}
        <WarmCake age={age} name={name} candlesLit={false} tiltX={0} blowIntensity={0} justBlownOut={justBlownOut} />

        {/* 연기 코멘트 */}
        <p style={{
          fontFamily: FONT, fontSize: "clamp(13px, 3.5vw, 16px)", color: C.faded,
          margin: "8px 0 0 0", animation: "fadeIn 1.5s ease-out",
        }}>
          {getSmokeComment(age)}
        </p>

        {/* 나이 */}
        <div style={{
          margin: "16px auto", padding: "8px 20px",
          border: `2px dashed ${C.orange}`, borderRadius: 20,
          display: "inline-block", animation: "fadeIn 1.8s ease-out",
        }}>
          <span style={{ fontFamily: FONT, fontSize: "clamp(16px, 4vw, 22px)", color: C.orange, fontWeight: 700 }}>
            🎂 {age}살 생일 축하해!
          </span>
        </div>

        {/* 링크 복사 */}
        <div style={{ marginTop: 16, animation: "fadeIn 2s ease-out" }}>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href).then(() => alert("링크 복사됨! 🎂"));
            }}
            style={{ ...warmBtn, fontSize: 15, padding: "10px 28px" }}
          >
            🔗 케이크 링크 복사
          </button>
        </div>

        {/* 새 케이크 만들기 */}
        <div style={{ marginTop: 10, animation: "fadeIn 2.2s ease-out" }}>
          <button
            onClick={() => { window.location.hash = ""; window.location.reload(); }}
            style={{
              ...warmBtn, fontSize: 14, padding: "8px 20px",
              background: "transparent", border: `2px solid ${C.orange}`, color: C.orange,
            }}
          >
            🎂 나도 케이크 만들기
          </button>
        </div>
      </div>

      <AdBanner />

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

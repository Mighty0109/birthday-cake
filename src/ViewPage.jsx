import { useState, useCallback } from "react";
import { C, FONT, pageStyle, warmBtn } from "../constants/theme";
import { getRoast, getSmokeComment } from "../constants/roasts";
import { getCakeTheme } from "../utils/cakeTheme";
import { useGyroscope } from "../hooks/useGyroscope";
import { useMicrophone } from "../hooks/useMicrophone";
import { useCamera } from "../hooks/useCamera";
import { PaperGrain } from "../components/PaperGrain";
import { HandBox } from "../components/HandBox";
import { Starburst } from "../components/Starburst";
import { WarmCake } from "../components/WarmCake";
import { WarmConfetti } from "../components/WarmConfetti";
import { FaceEffects } from "../components/FaceEffects";
import { AdBanner } from "../components/AdBanner";

// ============================================================
// 👀 케이크 보기 페이지 (Intro → Lit → Done)
// ============================================================

export function ViewPage({ data }) {
  const { n: name, a: age, m: message } = data;
  const [phase, setPhase] = useState("intro");
  const [roast, setRoast] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // 커스텀 훅
  const { tiltX, requestPermission } = useGyroscope();
  const camera = useCamera();

  const handleDone = useCallback(() => {
    camera.stop();
    setPhase("done");
    setRoast(getRoast(age));
    setShowConfetti(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setTimeout(() => setShowConfetti(false), 5000);
  }, [age, camera]);

  const mic = useMicrophone({
    onDone: handleDone,
    failCount,
    setFailCount,
  });

  const handleIntroTap = async () => {
    await requestPermission();
    const ok = await mic.start();
    camera.start();
    setPhase("lit");
    if (ok) setTimeout(() => mic.startDetection(), 500);
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
            <span style={{ fontFamily: FONT, fontSize: 16, color: C.mustard, fontWeight: 700 }}>톡! 터치!</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#554433", marginTop: 20 }}>
            ※ 마이크 권한이 필요해 (후~ 불어서 끄려면)
          </p>
        </div>
      </div>
    );
  }

  // ─── LIT (카메라 배경) ───
  if (phase === "lit") {
    const glow = 1 - mic.blowIntensity * 0.7;
    return (
      <div style={{ ...pageStyle, background: C.darkBg, overflow: "hidden" }}>
        {/* 전면 카메라 배경 */}
        <video ref={camera.videoRef} autoPlay playsInline muted style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
          zIndex: 0,
          opacity: 0.5,
        }} />
        {/* 어두운 오버레이 */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: `radial-gradient(ellipse at 50% 60%, rgba(200,120,40,${0.15 * glow}) 0%, rgba(30,20,15,0.7) 60%)`,
        }} />
        {/* 셀카 효과 */}
        <FaceEffects active={camera.active} />
        <div style={{ zIndex: 1, textAlign: "center", paddingTop: "25vh" }}>
          <WarmCake age={age} name={name} candlesLit={true} tiltX={tiltX} blowIntensity={mic.blowIntensity} />

          <div style={{ marginTop: 28, animation: "fadeIn 1s ease-out 0.5s both" }}>
            <p style={{ fontFamily: FONT, fontSize: "clamp(18px, 5vw, 26px)", color: C.mustard }}>
              소원 빌고... 후~ 불어봐! 🌬️
            </p>
            <div style={{ minHeight: 30, marginTop: 10 }}>
              {failCount > 0 && mic.blowIntensity < 0.1 && (
                <p style={{ fontFamily: FONT, fontSize: "clamp(14px, 4vw, 18px)", color: C.dustyPink, margin: 0, animation: "shake 0.5s ease-out" }}>
                  {failCount === 1 && "ㅋㅋ 폐활량 실화?"}
                  {failCount === 2 && "좀 더 세게 불어봐 ㅋㅋㅋ"}
                  {failCount >= 3 && "혹시 지금 무호흡? 😂"}
                </p>
              )}
            </div>
          </div>

          {/* 바람 세기 게이지 */}
          <div style={{ marginTop: 18, width: 180, marginLeft: "auto", marginRight: "auto" }}>
            <p style={{ fontFamily: FONT, fontSize: 12, color: C.mustard, marginBottom: 4, textAlign: "left" }}>바람 세기 ~</p>
            <div style={{ width: "100%", height: 12, background: "rgba(255,255,255,0.15)", borderRadius: 6, border: `2px solid ${C.mustard}60`, overflow: "hidden" }}>
              <div style={{
                width: `${mic.blowIntensity * 100}%`, height: "100%",
                background: mic.blowIntensity > 0.7 ? C.orange : mic.blowIntensity > 0.3 ? C.mustard : C.sage,
                borderRadius: 4, transition: "width 0.1s, background 0.2s",
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── DONE ───
  const theme = getCakeTheme(age);
  return (
    <div style={{ ...pageStyle, background: C.paper, overflow: "hidden" }}>
      <PaperGrain />
      {showConfetti && <WarmConfetti />}
      <Starburst size={150} color={C.mustard} style={{ position: "absolute", top: -20, right: -30 }} />
      <Starburst size={100} color={C.dustyPink} style={{ position: "absolute", bottom: 30, left: -20 }} />

      <div style={{ animation: "bounceIn 0.6s ease-out", textAlign: "center", zIndex: 1, width: "100%", maxWidth: 380 }}>
        <div style={{ fontSize: "clamp(40px, 12vw, 64px)", marginBottom: 8, animation: "tada 1s ease-out" }}>🎉</div>

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
          {getSmokeComment(age)}
        </p>

        {/* 디스 메시지 */}
        <HandBox color={C.mustard} style={{ marginTop: 20, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontFamily: FONT, fontSize: "clamp(15px, 4vw, 20px)", color: C.brown, lineHeight: 1.6, margin: 0, wordBreak: "keep-all" }}>
            {roast}
          </p>
        </HandBox>

        {/* 비밀 메시지 */}
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

        <AdBanner slot="3333333333" style={{ marginTop: 16 }} />

        <button
          onClick={() => { window.location.hash = ""; window.location.reload(); }}
          style={{ ...warmBtn, marginTop: 12 }}
        >
          🎂 나도 케이크 보내기
        </button>
      </div>
    </div>
  );
}

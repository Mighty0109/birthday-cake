import { useState, useCallback, useRef } from "react";
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
  const [justBlownOut, setJustBlownOut] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null); // 셀카 미리보기

  const { tiltX, requestPermission } = useGyroscope();
  const camera = useCamera();
  const cameraStopRef = useRef(camera.stop);
  cameraStopRef.current = camera.stop;

  const handleDone = useCallback(() => {
    cameraStopRef.current();
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
    // ⚠️ 자이로 권한을 맨 먼저! iOS는 터치 직후에만 허용
    try { await requestPermission(); } catch {}
    const micOk = await mic.start();
    await camera.start();
    setPhase("lit");
    if (micOk) setTimeout(() => mic.startDetection(), 500);
  };

  // 📸 셀카 캡처 (케이크 포함, iOS 호환)
  const handleCapture = useCallback(() => {
    const container = document.querySelector("[data-capture]");
    if (!container) return;
    const video = container.querySelector("video");
    if (!video) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const dpr = 2;
    const canvas = document.createElement("canvas");
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    // ① 비디오 (object-fit:cover + mirror)
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw && vh) {
      const videoAR = vw / vh;
      const displayAR = cw / ch;
      let sw, sh, sx, sy;
      if (videoAR > displayAR) {
        sh = vh; sw = vh * displayAR;
        sx = (vw - sw) / 2; sy = 0;
      } else {
        sw = vw; sh = vw / displayAR;
        sx = 0; sy = (vh - sh) / 2;
      }
      ctx.save();
      ctx.translate(cw, 0);
      ctx.scale(-1, 1);
      ctx.globalAlpha = 0.75;
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
      ctx.restore();
    }

    // ② 어두운 오버레이 (radial-gradient 재현)
    ctx.globalAlpha = 1;
    const grad = ctx.createRadialGradient(
      cw * 0.5, ch * 0.7, 0,
      cw * 0.5, ch * 0.7, Math.max(cw, ch) * 0.6
    );
    grad.addColorStop(0, "rgba(200,120,40,0.12)");
    grad.addColorStop(1, "rgba(30,20,15,0.75)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // ③ 케이크 SVG 캡처
    const cakeSvg = container.querySelector("svg[data-cake]");
    const contRect = container.getBoundingClientRect();

    const finalize = () => {
      // 하단 텍스트
      ctx.fillStyle = "rgba(20,15,10,0.6)";
      ctx.fillRect(0, ch - 50, cw, 50);
      ctx.font = "bold 16px 'Gaegu', cursive";
      ctx.fillStyle = "#D4A535";
      ctx.textAlign = "center";
      ctx.fillText("🎂 생일 축하해! 후~ 🌬️", cw / 2, ch - 20);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setCapturedImg(dataUrl);
    };

    if (cakeSvg) {
      const svgRect = cakeSvg.getBoundingClientRect();
      const ex = svgRect.left - contRect.left;
      const ey = svgRect.top - contRect.top;
      const ew = svgRect.width;
      const eh = svgRect.height;
      const clone = cakeSvg.cloneNode(true);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const svgStr = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, ex, ey, ew, eh);
        URL.revokeObjectURL(url);
        finalize();
      };
      img.onerror = () => { URL.revokeObjectURL(url); finalize(); };
      img.src = url;
    } else {
      finalize();
    }
  }, []);

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
            border: "2px dashed " + C.mustard, borderRadius: 24,
            animation: "pulse 1.5s ease-in-out infinite",
          }}>
            <span style={{ fontFamily: FONT, fontSize: 16, color: C.mustard, fontWeight: 700 }}>톡! 터치!</span>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#554433", marginTop: 20 }}>
            ※ 마이크 + 카메라 권한이 필요해
          </p>
        </div>
      </div>
    );
  }

  // ─── LIT (카메라 배경 + 케이크 최하단) ───
  if (phase === "lit") {
    const glow = 1 - mic.blowIntensity * 0.7;
    return (
      <div data-capture style={{ ...pageStyle, background: C.darkBg, overflow: "visible" }}>
        {/* 전면 카메라 */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
          <video ref={camera.videoRef} autoPlay playsInline muted style={{
            width: "100%", height: "100%",
            objectFit: "cover", transform: "scaleX(-1)",
            opacity: 0.75,
          }} />
        </div>
        {/* 어두운 오버레이 */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse at 50% 70%, rgba(200,120,40," + (0.2 * glow) + ") 0%, rgba(30,20,15,0.55) 60%)",
        }} />

        {/* 📸 셀카 버튼 */}
        {camera.active && (
          <button onClick={handleCapture} style={{
            position: "absolute", bottom: 16, right: 16, zIndex: 3,
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
            border: "3px solid #fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          }}>📸</button>
        )}

        {/* 케이크 - 하단에서 살짝 위 */}
        <div style={{
          position: "absolute", bottom: 80, left: 0, right: 0,
          zIndex: 1, textAlign: "center", overflow: "visible",
        }}>
          <div style={{ transform: "scale(0.65)", transformOrigin: "center bottom" }}>
            <WarmCake age={age} name={name} candlesLit={true} tiltX={tiltX} blowIntensity={mic.blowIntensity} />
          </div>
        </div>

        {/* 하단 UI - 맨 아래 고정 */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          zIndex: 2, textAlign: "center",
          padding: "12px 0 16px",
          background: "linear-gradient(transparent, rgba(20,15,10,0.9) 40%)",
        }}>
          {/* 바람 세기 게이지 */}
          <div style={{ width: 120, margin: "0 auto 6px" }}>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: (mic.blowIntensity * 100) + "%", height: "100%",
                background: mic.blowIntensity > 0.7 ? C.orange : mic.blowIntensity > 0.3 ? C.mustard : C.sage,
                borderRadius: 3, transition: "width 0.1s",
              }} />
            </div>
          </div>

          {/* 폐활량 디스 */}
          <div style={{ minHeight: 18 }}>
            {failCount > 0 && mic.blowIntensity < 0.1 && (
              <p style={{ fontFamily: FONT, fontSize: 12, color: C.dustyPink, margin: 0, animation: "shake 0.5s ease-out" }}>
                {failCount === 1 && "ㅋㅋ 폐활량 실화?"}
                {failCount === 2 && "좀 더 세게 불어봐 ㅋㅋㅋ"}
                {failCount >= 3 && "혹시 지금 무호흡? 😂"}
              </p>
            )}
          </div>

          <p style={{ fontFamily: FONT, fontSize: "clamp(14px, 4vw, 18px)", color: C.mustard, margin: 0 }}>
            소원 빌고... 후~ 불어봐! 🌬️
          </p>
        </div>

        {/* 📷 셀카 미리보기 모달 */}
        {capturedImg && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "rgba(0,0,0,0.85)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: 20,
          }}>
            <img
              src={capturedImg}
              alt="셀카"
              style={{
                maxWidth: "90%", maxHeight: "65vh",
                borderRadius: 12, border: "3px solid #fff",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              }}
            />
            <p style={{
              fontFamily: FONT, fontSize: 16, color: C.cream,
              marginTop: 16, textAlign: "center",
            }}>
              📱 이미지를 <b>길게 눌러</b> 저장하세요!
            </p>
            <button
              onClick={() => setCapturedImg(null)}
              style={{
                marginTop: 12, padding: "10px 28px",
                background: C.mustard, border: "none",
                borderRadius: 20, fontFamily: FONT,
                fontSize: 15, fontWeight: 700,
                color: "#fff", cursor: "pointer",
              }}
            >
              ✕ 닫기
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── DONE ───
  const theme = getCakeTheme(age);
  return (
    <div style={{ ...pageStyle, background: C.paper, overflow: "visible" }}>
      <PaperGrain />
      {showConfetti && <WarmConfetti />}
      <Starburst size={150} color={C.mustard} style={{ position: "absolute", top: -20, right: -30 }} />
      <Starburst size={100} color={C.dustyPink} style={{ position: "absolute", bottom: 30, left: -20 }} />

      <div style={{ animation: "bounceIn 0.6s ease-out", textAlign: "center", zIndex: 1, width: "100%", maxWidth: 380, overflow: "visible" }}>
        <div style={{ fontSize: "clamp(40px, 12vw, 64px)", marginBottom: 8, animation: "tada 1s ease-out" }}>🎉</div>

        <div style={{
          display: "inline-block", padding: "8px 24px", marginBottom: 16,
          border: "3px solid " + C.orange, borderRadius: "50%",
          transform: "rotate(-4deg)",
          boxShadow: "inset 0 0 0 2px " + C.orange + "40",
        }}>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(18px, 5vw, 28px)", color: C.orange, margin: 0 }}>
            생일 축하해!
          </h2>
        </div>

        <p style={{ fontFamily: FONT, fontSize: "clamp(20px, 6vw, 32px)", color: C.ink, margin: "0 0 16px 0", fontWeight: 700 }}>
          {name}
        </p>

        {/* 케이크 + 연기 (overflow visible 필수!) */}
        <div style={{ overflow: "visible", position: "relative" }}>
          <WarmCake age={age} name={name} candlesLit={false} tiltX={tiltX} blowIntensity={0} justBlownOut={justBlownOut} />
        </div>

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
            background: C.cream, border: "1px solid " + C.faded,
            borderRadius: 4, padding: "16px 20px",
            boxShadow: "3px 3px 0 " + C.faded + "40",
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

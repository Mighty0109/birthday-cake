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
  const [capturedImg, setCapturedImg] = useState(null);

  const { tiltX, requestPermission } = useGyroscope();
  const camera = useCamera();
  const cameraStopRef = useRef(camera.stop);
  cameraStopRef.current = camera.stop;

  // ─── 사진 캡처 (동기 - 비디오만) ───
  const capturePhoto = useCallback(() => {
    try {
      const container = document.querySelector("[data-capture]");
      const video = container?.querySelector("video");
      if (!video || !video.videoWidth) return null;

      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const dpr = 2;
      const canvas = document.createElement("canvas");
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      // 비디오 (mirror)
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const videoAR = vw / vh;
      const displayAR = cw / ch;
      let sw, sh, sx, sy;
      if (videoAR > displayAR) {
        sh = vh; sw = vh * displayAR; sx = (vw - sw) / 2; sy = 0;
      } else {
        sw = vw; sh = vw / displayAR; sx = 0; sy = (vh - sh) / 2;
      }
      ctx.save();
      ctx.translate(cw, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
      ctx.restore();

      // 어두운 오버레이
      const grad = ctx.createRadialGradient(
        cw * 0.5, ch * 0.7, 0,
        cw * 0.5, ch * 0.7, Math.max(cw, ch) * 0.6
      );
      grad.addColorStop(0, "rgba(200,120,40,0.15)");
      grad.addColorStop(1, "rgba(30,20,15,0.5)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // 하단 텍스트
      ctx.fillStyle = "rgba(20,15,10,0.6)";
      ctx.fillRect(0, ch - 50, cw, 50);
      ctx.font = "bold 16px 'Gaegu', cursive";
      ctx.fillStyle = "#D4A535";
      ctx.textAlign = "center";
      ctx.fillText("\uD83C\uDF82 \uC0DD\uC77C \uCD95\uD558\uD574! \uD6C4~ \uD83C\uDF2C\uFE0F", cw / 2, ch - 20);

      return canvas.toDataURL("image/jpeg", 0.92);
    } catch (e) {
      return null;
    }
  }, []);

  // ─── 불기 완료 ───
  const handleDone = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

    // 사진 캡처 (카메라 종료 전!)
    const photo = capturePhoto();
    if (photo) setCapturedImg(photo);

    // 카메라 종료 + done 전환
    cameraStopRef.current();
    setPhase("done");
    setJustBlownOut(true);
    setRoast(getRoast(age));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }, [age, capturePhoto]);

  const mic = useMicrophone({
    onDone: handleDone,
    failCount,
    setFailCount,
  });

  const handleIntroTap = async () => {
    try { await requestPermission(); } catch {}
    const micOk = await mic.start();
    await camera.start();
    setPhase("lit");
    if (micOk) setTimeout(() => mic.startDetection(), 500);
  };

  // 이미지 저장
  const handleSaveImg = useCallback(() => {
    if (!capturedImg) return;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const w = window.open();
      if (w) {
        w.document.write(
          '<html><head><title>\uC0DD\uC77C \uC0AC\uC9C4</title>' +
          '<meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<style>body{margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;}img{max-width:100%;max-height:100vh;}</style>' +
          '</head><body><img src="' + capturedImg + '" /></body></html>'
        );
        w.document.close();
      }
    } else {
      const a = document.createElement("a");
      a.href = capturedImg;
      a.download = "birthday-" + name + "-" + Date.now() + ".jpg";
      a.click();
    }
  }, [capturedImg, name]);

  // ─── INTRO ───
  if (phase === "intro") {
    return (
      <div onClick={handleIntroTap} style={{ ...pageStyle, background: C.darkBg, cursor: "pointer" }}>
        <PaperGrain dark />
        <div style={{ animation: "pulse 2.5s ease-in-out infinite", textAlign: "center", zIndex: 1 }}>
          <div style={{ fontSize: "clamp(60px, 18vw, 90px)", marginBottom: 16, filter: "drop-shadow(0 0 25px rgba(255,160,50,0.6))" }}>{"\uD83C\uDF82"}</div>
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

  // ─── LIT (카메라 배경 + 케이크) ───
  if (phase === "lit") {
    const glow = 1 - mic.blowIntensity * 0.7;
    return (
      <div data-capture style={{ ...pageStyle, background: C.darkBg, overflow: "visible" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
          <video ref={camera.videoRef} autoPlay playsInline muted style={{
            width: "100%", height: "100%",
            objectFit: "cover", transform: "scaleX(-1)",
            opacity: 0.75,
          }} />
        </div>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse at 50% 70%, rgba(200,120,40," + (0.2 * glow) + ") 0%, rgba(30,20,15,0.55) 60%)",
        }} />

        <div style={{
          position: "absolute", bottom: 80, left: 0, right: 0,
          zIndex: 1, textAlign: "center", overflow: "visible",
        }}>
          <div style={{ transform: "scale(0.78)", transformOrigin: "center bottom" }}>
            <WarmCake age={age} name={name} candlesLit={true} tiltX={tiltX} blowIntensity={mic.blowIntensity} />
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          zIndex: 2, textAlign: "center",
          padding: "12px 0 16px",
          background: "linear-gradient(transparent, rgba(20,15,10,0.9) 40%)",
        }}>
          <div style={{ width: 120, margin: "0 auto 6px" }}>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: (mic.blowIntensity * 100) + "%", height: "100%",
                background: mic.blowIntensity > 0.7 ? C.orange : mic.blowIntensity > 0.3 ? C.mustard : C.sage,
                borderRadius: 3, transition: "width 0.1s",
              }} />
            </div>
          </div>
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
      </div>
    );
  }

  // ─── DONE ───
  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 30,
      paddingBottom: 40,
      paddingLeft: 16,
      paddingRight: 16,
      background: C.darkBg,
      position: "relative",
    }}>
      {showConfetti && <WarmConfetti />}

      <div style={{ textAlign: "center", zIndex: 1, width: "100%", maxWidth: 400 }}>
        <div style={{ fontSize: "clamp(36px, 10vw, 56px)", marginBottom: 4, animation: "tada 1s ease-out" }}>{"\uD83C\uDF89"}</div>
        <h2 style={{ fontFamily: FONT, fontSize: "clamp(22px, 6vw, 32px)", color: C.cream, margin: "0 0 12px" }}>
          생일 축하해, {name}!
        </h2>

        {capturedImg ? (
          <div style={{ margin: "0 auto 16px", textAlign: "center" }}>
            <img
              src={capturedImg}
              alt="생일 셀카"
              style={{
                width: "85vw", maxWidth: 340,
                borderRadius: 16,
                border: "3px solid " + C.mustard,
                boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
                display: "block",
                margin: "0 auto",
              }}
            />
            <p style={{
              fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.5)",
              marginTop: 6,
            }}>
              📱 이미지를 길게 눌러도 저장 가능
            </p>
          </div>
        ) : (
          <div style={{ overflow: "visible", position: "relative", margin: "0 0 16px" }}>
            <WarmCake age={age} name={name} candlesLit={false} tiltX={tiltX} blowIntensity={0} justBlownOut={justBlownOut} />
          </div>
        )}

        <HandBox color={C.mustard} style={{ maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontFamily: FONT, fontSize: "clamp(15px, 4vw, 20px)", color: C.brown, lineHeight: 1.6, margin: 0, wordBreak: "keep-all" }}>
            {roast}
          </p>
        </HandBox>

        {message && (
          <div style={{
            marginTop: 12, maxWidth: 320, marginLeft: "auto", marginRight: "auto",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12, padding: "14px 18px",
          }}>
            <p style={{ fontFamily: FONT, fontSize: 13, color: C.faded, margin: "0 0 6px 0" }}>💌 비밀 메시지 ~</p>
            <p style={{ fontFamily: FONT, fontSize: "clamp(16px, 4.5vw, 20px)", color: C.cream, lineHeight: 1.5, margin: 0, wordBreak: "keep-all" }}>
              "{message}"
            </p>
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          {capturedImg && (
            <button onClick={handleSaveImg} style={{
              ...warmBtn, background: C.mustard, color: "#fff",
              width: "80%", maxWidth: 280,
            }}>
              💾 사진 저장하기
            </button>
          )}
          <button
            onClick={() => { window.location.hash = ""; window.location.reload(); }}
            style={{ ...warmBtn, width: "80%", maxWidth: 280 }}
          >
            🎂 나도 케이크 보내기
          </button>
        </div>

        <AdBanner slot="3333333333" style={{ marginTop: 16 }} />
      </div>
    </div>
  );
}

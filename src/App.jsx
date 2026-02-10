import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// 🎂 "촛불 끄셈 ㅋㅋ" - Gen Z Birthday Cake Web App
// ============================================================

const ROASTS = {
  child: [
    "우와~ 벌써 {age}살이야?! 다 컸네!! 🌟",
    "{age}살 축하해! 산타 아직 믿지? 🎅",
    "짝짝짝! {age}살 되셨습니다~ 👏",
  ],
  teen: [
    "{age}살 ㅊㅋ~ 사춘기 파이팅 ㅋㅋ 🫠",
    "중2병은 나았어? {age}살 축하 ㅋ",
    "{age}살이면... 아직 급식충? ㅋㅋㅋ 축하해 🍱",
  ],
  twenty: [
    "{age}살 축하~ MZ세대 공식 등록 완료 ✌️",
    "이제 {age}살이면 중고신입이다 ㅋㅋ",
    "{age}번째 생존 축하해 ㅋㅋ 남은 대출 화이팅 💸",
    "{age}살? 벌써 아재/아줌마 소리 들을 나이 ㅋ",
  ],
  thirty: [
    "{age}살 ㅊㅋ... 이제 무릎 조심해 🦵",
    "30대 입장~ {age}살에는 건강검진 필수 ㅋ",
    "{age}살이면 이제 '요즘 것들' 시전 가능 ㅋㅋ",
    "축하합니다 {age}살! 이제 10시면 졸리죠? 😴",
  ],
  forty: [
    "{age}살 축하드립니다 선배님... 🫡",
    "불이 너무 많아서 소방서 신고할 뻔 🚒",
    "{age}개의 초... 케이크가 불바다 ㅋㅋㅋ 🔥",
    "{age}살 축하해요! 건강이 최고입니다 진짜로 💪",
  ],
  fifty: [
    "🚒 소방차 출동!! {age}살 어르신 생축!! 🚒",
    "{age}살?! 레전드... 존경합니다 🫡🫡🫡",
    "초 {age}개는 좀... 화재 위험 ㅋㅋㅋㅋ",
    "{age}번째 생일 축하드립니다 대선배님!! 🎖️",
  ],
};

function getRoast(age) {
  let category;
  if (age <= 12) category = "child";
  else if (age <= 19) category = "teen";
  else if (age <= 29) category = "twenty";
  else if (age <= 39) category = "thirty";
  else if (age <= 49) category = "forty";
  else category = "fifty";
  const list = ROASTS[category];
  const msg = list[Math.floor(Math.random() * list.length)];
  return msg.replace("{age}", age);
}

function getCakeTheme(age) {
  if (age <= 12)
    return {
      cakeColor: "#FF9ECD",
      cakeColor2: "#FFB6D9",
      frostingColor: "#fff",
      plateColor: "#FFD700",
      label: "귀요미 케이크 🧁",
    };
  if (age <= 19)
    return {
      cakeColor: "#7B2FBE",
      cakeColor2: "#9B4FDE",
      frostingColor: "#00ff88",
      plateColor: "#333",
      label: "급식 특별 케이크 🍰",
    };
  if (age <= 29)
    return {
      cakeColor: "#1a1a2e",
      cakeColor2: "#16213e",
      frostingColor: "#e94560",
      plateColor: "#0f3460",
      label: "힙한 네온 케이크 🎂",
    };
  if (age <= 39)
    return {
      cakeColor: "#2d1b69",
      cakeColor2: "#3d2b79",
      frostingColor: "#ff6b6b",
      plateColor: "#1a0a3e",
      label: "인생은 지금부터 케이크 🔥",
    };
  return {
    cakeColor: "#8B0000",
    cakeColor2: "#A52A2A",
    frostingColor: "#FF4500",
    plateColor: "#333",
    label: "🚒 소방관 출동 케이크 🚒",
  };
}

// Encode/Decode for URL sharing
function encodeData(obj) {
  try {
    return btoa(
      encodeURIComponent(JSON.stringify(obj)).replace(
        /%([0-9A-F]{2})/g,
        (_, p1) => String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch {
    return "";
  }
}

function decodeData(str) {
  try {
    return JSON.parse(
      decodeURIComponent(
        Array.from(atob(str))
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    return null;
  }
}

// ============================================================
// Candle Flame Component
// ============================================================
function Flame({ lit, tiltX = 0, tiltY = 0, blowIntensity = 0, delay = 0 }) {
  const flickerRef = useRef(null);
  const [flicker, setFlicker] = useState(0);

  useEffect(() => {
    if (!lit) return;
    const id = setInterval(() => {
      setFlicker(Math.random() * 6 - 3);
    }, 80 + delay * 10);
    flickerRef.current = id;
    return () => clearInterval(id);
  }, [lit, delay]);

  if (!lit) return null;

  const skewX = tiltX * 2 + flicker;
  const skewY = tiltY * 0.5;
  const scale = Math.max(0, 1 - blowIntensity * 0.7);
  const opacity = Math.max(0.2, 1 - blowIntensity * 0.5);

  return (
    <div
      style={{
        position: "absolute",
        top: -22,
        left: "50%",
        transform: `translateX(-50%) skewX(${skewX}deg) scaleY(${scale})`,
        transition: "transform 0.08s ease-out",
        opacity,
        filter: `blur(${blowIntensity * 1.5}px)`,
      }}
    >
      {/* Outer glow */}
      <div
        style={{
          position: "absolute",
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,50,0.4), transparent 70%)",
          top: -8,
          left: -8,
        }}
      />
      {/* Flame body */}
      <div
        style={{
          width: 12,
          height: 20,
          background: "linear-gradient(to top, #ff4400, #ff8800, #ffcc00, #fff)",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          boxShadow: "0 0 8px #ff8800, 0 0 20px rgba(255,136,0,0.5), 0 0 40px rgba(255,68,0,0.3)",
        }}
      />
    </div>
  );
}

// ============================================================
// Candle Component
// ============================================================
function Candle({ lit, tiltX, tiltY, blowIntensity, index, total }) {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"];
  const color = colors[index % colors.length];
  const stripeColor = colors[(index + 3) % colors.length];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        margin: "0 2px",
      }}
    >
      {/* Flame */}
      <div style={{ position: "relative", height: 24, width: 14 }}>
        <Flame
          lit={lit}
          tiltX={tiltX}
          tiltY={tiltY}
          blowIntensity={blowIntensity}
          delay={index}
        />
      </div>
      {/* Wick */}
      <div
        style={{
          width: 2,
          height: 6,
          background: "#333",
          borderRadius: 1,
        }}
      />
      {/* Candle body */}
      <div
        style={{
          width: 10,
          height: 32 + (index % 3) * 6,
          background: `repeating-linear-gradient(0deg, ${color}, ${color} 4px, ${stripeColor} 4px, ${stripeColor} 8px)`,
          borderRadius: "3px 3px 1px 1px",
          border: "1px solid rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}

// ============================================================
// Cake SVG Component
// ============================================================
function CakeDisplay({ age, name, candlesLit, tiltX, tiltY, blowIntensity }) {
  const theme = getCakeTheme(age);
  const numCandles = Math.min(age, 30);
  const rows = [];
  let remaining = numCandles;

  if (numCandles <= 5) {
    rows.push(numCandles);
  } else if (numCandles <= 12) {
    rows.push(Math.ceil(numCandles / 2));
    rows.push(Math.floor(numCandles / 2));
  } else {
    const perRow = Math.ceil(numCandles / 3);
    rows.push(perRow);
    rows.push(perRow);
    rows.push(numCandles - perRow * 2);
  }

  let candleIndex = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Candles */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {rows.map((count, rowIdx) => (
          <div key={rowIdx} style={{ display: "flex", justifyContent: "center" }}>
            {Array.from({ length: count }).map((_, i) => {
              const idx = candleIndex++;
              return (
                <Candle
                  key={idx}
                  index={idx}
                  total={numCandles}
                  lit={candlesLit}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  blowIntensity={blowIntensity}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Cake body */}
      <div style={{ position: "relative", width: "min(85vw, 320px)" }}>
        {/* Frosting drip */}
        <div
          style={{
            position: "absolute",
            top: -6,
            left: "5%",
            width: "90%",
            height: 20,
            background: theme.frostingColor,
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            zIndex: 2,
          }}
        />
        {/* Frosting drips */}
        {[15, 30, 50, 70, 82].map((left, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 8,
              left: `${left}%`,
              width: 12 + (i % 2) * 6,
              height: 16 + (i % 3) * 8,
              background: theme.frostingColor,
              borderRadius: "0 0 50% 50%",
              zIndex: 2,
            }}
          />
        ))}

        {/* Top layer */}
        <div
          style={{
            width: "100%",
            height: 60,
            background: `linear-gradient(135deg, ${theme.cakeColor}, ${theme.cakeColor2})`,
            borderRadius: "8px 8px 0 0",
            border: `2px solid rgba(255,255,255,0.1)`,
            borderBottom: "none",
            position: "relative",
          }}
        />
        {/* Bottom layer */}
        <div
          style={{
            width: "100%",
            height: 50,
            background: `linear-gradient(135deg, ${theme.cakeColor2}, ${theme.cakeColor})`,
            borderRadius: "0 0 12px 12px",
            border: `2px solid rgba(255,255,255,0.1)`,
            borderTop: `3px solid ${theme.frostingColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Gaegu', cursive",
              color: theme.frostingColor,
              fontSize: "clamp(14px, 4vw, 22px)",
              fontWeight: 700,
              textShadow: "0 0 10px rgba(255,255,255,0.3)",
              letterSpacing: 1,
            }}
          >
            {name}
          </span>
        </div>

        {/* Plate */}
        <div
          style={{
            width: "115%",
            height: 16,
            background: `linear-gradient(to bottom, ${theme.plateColor}, ${theme.plateColor}dd)`,
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            margin: "0 auto",
            marginLeft: "-7.5%",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Age badge */}
      {age >= 50 && (
        <div
          style={{
            marginTop: 12,
            padding: "4px 16px",
            background: "#ff4400",
            borderRadius: 4,
            fontFamily: "'Gaegu', cursive",
            fontSize: 14,
            color: "#fff",
            animation: "blink 0.5s infinite",
          }}
        >
          🚨 화재경보 발령 🚨
        </div>
      )}
    </div>
  );
}

// ============================================================
// Confetti Component
// ============================================================
function Confetti() {
  const pieces = useRef(
    Array.from({ length: 60 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFEAA7", "#FF9FF3", "#54A0FF", "#5F27CD", "#FF9F43"][
        Math.floor(Math.random() * 8)
      ],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      type: Math.random() > 0.5 ? "circle" : "rect",
    }))
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {pieces.current.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: -20,
            width: p.type === "circle" ? p.size : p.size * 0.6,
            height: p.size,
            background: p.color,
            borderRadius: p.type === "circle" ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// Create Page
// ============================================================
function CreatePage({ onDone }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0); // 0: form, 1: preview

  const handleCreate = () => {
    if (!name.trim() || !age) return;
    setStep(1);
  };

  const handleShare = () => {
    const data = encodeData({
      n: name.trim(),
      a: parseInt(age),
      m: message.trim(),
    });
    const url = `${window.location.origin}${window.location.pathname}#cake=${data}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert("링크가 복사됐어! 🎂\n카톡이나 인스타 DM으로 보내면 돼~");
      });
    } else {
      prompt("이 링크를 복사해서 보내줘:", url);
    }
  };

  if (step === 0) {
    return (
      <div style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}>
        <div style={{
          animation: "bounceIn 0.6s ease-out",
          textAlign: "center",
          width: "100%",
          maxWidth: 360,
        }}>
          <div style={{ fontSize: "clamp(48px, 15vw, 80px)", marginBottom: 8 }}>🎂</div>
          <h1 style={{
            fontFamily: "'Gaegu', cursive",
            fontSize: "clamp(28px, 8vw, 42px)",
            color: "#fff",
            margin: "0 0 4px 0",
            textShadow: "0 0 20px rgba(255,100,50,0.5)",
          }}>
            촛불 끄셈 ㅋㅋ
          </h1>
          <p style={{
            fontFamily: "'Gaegu', cursive",
            fontSize: "clamp(14px, 4vw, 18px)",
            color: "#888",
            margin: "0 0 32px 0",
          }}>
            생일 케이크 만들어서 보내기
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>🎉 생일인 사람 이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 입력"
                maxLength={20}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>🕯️ 나이 (초 개수가 됨 ㅋ)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="나이 입력"
                min={1}
                max={120}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>💌 한마디 (촛불 끄면 보임)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="생축 메시지 입력 (선택)"
                maxLength={100}
                rows={2}
                style={{ ...inputStyle, resize: "none", height: "auto" }}
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={!name.trim() || !age}
              style={{
                ...buttonStyle,
                opacity: !name.trim() || !age ? 0.4 : 1,
                cursor: !name.trim() || !age ? "not-allowed" : "pointer",
              }}
            >
              🔥 케이크 만들기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preview
  const ageNum = parseInt(age);
  const theme = getCakeTheme(ageNum);
  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <p style={{
        fontFamily: "'Gaegu', cursive",
        fontSize: 16,
        color: "#888",
        margin: "0 0 8px 0",
      }}>
        미리보기 👀
      </p>
      <p style={{
        fontFamily: "'Gaegu', cursive",
        fontSize: 14,
        color: "#666",
        margin: "0 0 24px 0",
        padding: "4px 12px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
      }}>
        {theme.label}
      </p>

      <CakeDisplay
        age={ageNum}
        name={name}
        candlesLit={true}
        tiltX={0}
        tiltY={0}
        blowIntensity={0}
      />

      <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => setStep(0)} style={{ ...buttonStyle, background: "#333", flex: "1 1 140px" }}>
          ← 다시 만들기
        </button>
        <button onClick={handleShare} style={{ ...buttonStyle, flex: "1 1 140px" }}>
          🔗 링크 복사해서 보내기
        </button>
      </div>
    </div>
  );
}

// ============================================================
// View Page (Receiver)
// ============================================================
function ViewPage({ data }) {
  const { n: name, a: age, m: message } = data;
  const [phase, setPhase] = useState("intro"); // intro → lit → done
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [blowIntensity, setBlowIntensity] = useState(0);
  const [hasGyro, setHasGyro] = useState(false);
  const [roast, setRoast] = useState("");
  const [failCount, setFailCount] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const blowAccumRef = useRef(0);
  const animFrameRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Gyroscope
  useEffect(() => {
    const handler = (e) => {
      setHasGyro(true);
      const x = Math.max(-30, Math.min(30, e.gamma || 0));
      const y = Math.max(-30, Math.min(30, e.beta || 0));
      setTiltX(x);
      setTiltY(y);
    };

    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      // iOS - will request on tap
    } else {
      window.addEventListener("deviceorientation", handler);
    }

    return () => {
      window.removeEventListener("deviceorientation", handler);
    };
  }, []);

  const requestGyroPermission = async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const perm = await DeviceOrientationEvent.requestPermission();
        if (perm === "granted") {
          window.addEventListener("deviceorientation", (e) => {
            setHasGyro(true);
            setTiltX(Math.max(-30, Math.min(30, e.gamma || 0)));
            setTiltY(Math.max(-30, Math.min(30, e.beta || 0)));
          });
        }
      } catch (e) {
        console.log("Gyro permission denied");
      }
    }
  };

  // Mic setup
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;
      return true;
    } catch (e) {
      console.log("Mic permission denied");
      return false;
    }
  };

  // Blow detection loop
  const startBlowDetection = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const detect = () => {
      analyser.getByteFrequencyData(dataArray);
      // Focus on low frequencies (blowing sound)
      let sum = 0;
      const lowBins = Math.floor(dataArray.length * 0.3);
      for (let i = 0; i < lowBins; i++) {
        sum += dataArray[i];
      }
      const avg = sum / lowBins / 255;

      if (avg > 0.35) {
        blowAccumRef.current += avg * 0.08;
        setBlowIntensity(Math.min(1, blowAccumRef.current));

        if (blowAccumRef.current >= 1) {
          // Candles out!
          handleCandlesOut();
          return;
        }
      } else {
        // Decay
        blowAccumRef.current = Math.max(0, blowAccumRef.current - 0.02);
        setBlowIntensity(Math.max(0, blowAccumRef.current));

        if (blowAccumRef.current <= 0 && failCount < 3 && Math.random() < 0.005) {
          setFailCount((f) => f + 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, [failCount]);

  const handleCandlesOut = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setPhase("done");
    setRoast(getRoast(age));
    setShowConfetti(true);

    // Haptic
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleIntroTap = async () => {
    await requestGyroPermission();
    const micOk = await startMic();
    if (micOk) {
      setPhase("lit");
      setTimeout(() => startBlowDetection(), 500);
    } else {
      // Even without mic, let them view
      setPhase("lit");
    }
  };

  const handleShareMyOwn = () => {
    window.location.hash = "";
    window.location.reload();
  };

  // INTRO PHASE
  if (phase === "intro") {
    return (
      <div
        onClick={handleIntroTap}
        style={{
          minHeight: "100dvh",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          cursor: "pointer",
        }}
      >
        <div style={{
          animation: "pulse 2s ease-in-out infinite",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "clamp(60px, 20vw, 100px)", marginBottom: 16 }}>🎂</div>
          <p style={{
            fontFamily: "'Gaegu', cursive",
            fontSize: "clamp(22px, 6vw, 32px)",
            color: "#fff",
            margin: "0 0 8px 0",
          }}>
            {name}에게 케이크가 도착했어!
          </p>
          <p style={{
            fontFamily: "'Gaegu', cursive",
            fontSize: "clamp(14px, 4vw, 18px)",
            color: "#666",
            margin: 0,
          }}>
            화면을 터치해서 불을 붙이자 🔥
          </p>
          <p style={{
            fontFamily: "'Gaegu', cursive",
            fontSize: "clamp(11px, 3vw, 13px)",
            color: "#444",
            margin: "16px 0 0 0",
          }}>
            ※ 마이크 권한이 필요해 (후~ 불어서 끄려면)
          </p>
        </div>
      </div>
    );
  }

  // LIT PHASE
  if (phase === "lit") {
    const glowIntensity = 1 - blowIntensity * 0.7;
    return (
      <div style={{
        minHeight: "100dvh",
        background: `radial-gradient(ellipse at 50% 40%, rgba(255,150,50,${0.12 * glowIntensity}) 0%, rgba(0,0,0,1) 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        transition: "background 0.3s ease",
      }}>
        <CakeDisplay
          age={age}
          name={name}
          candlesLit={true}
          tiltX={tiltX}
          tiltY={tiltY}
          blowIntensity={blowIntensity}
        />

        <div style={{
          marginTop: 32,
          textAlign: "center",
          animation: "fadeIn 1s ease-out 0.5s both",
        }}>
          <p style={{
            fontFamily: "'Gaegu', cursive",
            fontSize: "clamp(18px, 5vw, 26px)",
            color: "#ffcc00",
            margin: "0 0 8px 0",
            textShadow: "0 0 15px rgba(255,200,0,0.5)",
          }}>
            소원 빌고... 후~ 불어봐! 🌬️
          </p>
          {hasGyro && (
            <p style={{
              fontFamily: "'Gaegu', cursive",
              fontSize: 13,
              color: "#555",
              margin: 0,
            }}>
              📱 폰을 기울이면 초가 움직여!
            </p>
          )}
        </div>

        {failCount > 0 && blowIntensity < 0.1 && (
          <p style={{
            fontFamily: "'Gaegu', cursive",
            fontSize: "clamp(13px, 3.5vw, 16px)",
            color: "#ff6b6b",
            marginTop: 12,
            animation: "shake 0.5s ease-out",
            textAlign: "center",
          }}>
            {failCount === 1 && "ㅋㅋ 폐활량 실화?"}
            {failCount === 2 && "좀 더 세게 불어봐 ㅋㅋㅋ"}
            {failCount >= 3 && "혹시 지금 무호흡? 😂"}
          </p>
        )}
      </div>
    );
  }

  // DONE PHASE
  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      overflow: "hidden",
    }}>
      {showConfetti && <Confetti />}

      <div style={{ animation: "bounceIn 0.6s ease-out", textAlign: "center" }}>
        <div style={{
          fontSize: "clamp(40px, 12vw, 72px)",
          marginBottom: 8,
          animation: "tada 1s ease-out",
        }}>
          🎉
        </div>
        <h2 style={{
          fontFamily: "'Gaegu', cursive",
          fontSize: "clamp(26px, 7vw, 40px)",
          color: "#fff",
          margin: "0 0 8px 0",
          textShadow: "0 0 20px rgba(255,100,200,0.5)",
        }}>
          생일 축하해, {name}!
        </h2>

        <CakeDisplay
          age={age}
          name={name}
          candlesLit={false}
          tiltX={0}
          tiltY={0}
          blowIntensity={0}
        />

        {/* Roast */}
        <p style={{
          fontFamily: "'Gaegu', cursive",
          fontSize: "clamp(16px, 4.5vw, 22px)",
          color: "#ffcc00",
          margin: "24px 0 8px 0",
          animation: "fadeIn 1s ease-out 0.3s both",
        }}>
          {roast}
        </p>

        {/* Message */}
        {message && (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "16px 20px",
            margin: "16px auto",
            maxWidth: 300,
            animation: "fadeIn 1s ease-out 0.8s both",
          }}>
            <p style={{
              fontFamily: "'Gaegu', cursive",
              fontSize: 13,
              color: "#888",
              margin: "0 0 4px 0",
            }}>
              💌 보낸 사람의 메시지
            </p>
            <p style={{
              fontFamily: "'Gaegu', cursive",
              fontSize: "clamp(16px, 4.5vw, 20px)",
              color: "#fff",
              margin: 0,
              lineHeight: 1.5,
            }}>
              "{message}"
            </p>
          </div>
        )}

        <button onClick={handleShareMyOwn} style={{ ...buttonStyle, marginTop: 24 }}>
          🎂 나도 케이크 보내기
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Styles
// ============================================================
const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "2px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontFamily: "'Gaegu', cursive",
  fontSize: 18,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontFamily: "'Gaegu', cursive",
  fontSize: 15,
  color: "#aaa",
  marginBottom: 6,
  textAlign: "left",
};

const buttonStyle = {
  padding: "14px 24px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #ff4400, #ff8800)",
  color: "#fff",
  fontFamily: "'Gaegu', cursive",
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(255,68,0,0.3)",
  transition: "transform 0.1s, box-shadow 0.1s",
  width: "100%",
};

// ============================================================
// Main App
// ============================================================
export default function App() {
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#cake=")) {
      const encoded = hash.slice(6);
      const data = decodeData(encoded);
      if (data && data.n && data.a) {
        setViewData(data);
      }
    }

    const onHashChange = () => {
      const h = window.location.hash;
      if (h.startsWith("#cake=")) {
        const d = decodeData(h.slice(6));
        if (d && d.n && d.a) setViewData(d);
      } else {
        setViewData(null);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { background: #000; overflow-x: hidden; }
        input:focus, textarea:focus { border-color: #ff8800 !important; }
        button:active { transform: scale(0.96) !important; }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes tada {
          0% { transform: scale(1) rotate(0); }
          10%, 20% { transform: scale(0.9) rotate(-3deg); }
          30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
          40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {viewData ? <ViewPage data={viewData} /> : <CreatePage />}
    </>
  );
}

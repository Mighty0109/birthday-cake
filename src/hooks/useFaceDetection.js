import { useState, useEffect, useRef } from "react";

// ============================================================
// 👤 얼굴 감지 훅 (브라우저 FaceDetector API)
// object-fit:cover + scaleX(-1) 보정 포함
// Chromium 계열에서 동작, 미지원 시 faceBox=null (fallback)
// ============================================================

export function useFaceDetection(videoElRef, active) {
  const [faceBox, setFaceBox] = useState(null);
  const [supported, setSupported] = useState(false);
  const detectorRef = useRef(null);
  const animRef = useRef(null);
  const lastRef = useRef(null);

  const SMOOTH = 0.3;
  const lerp = (a, b, t) => a + (b - a) * t;

  // FaceDetector 초기화
  useEffect(() => {
    if (typeof window.FaceDetector === "function") {
      try {
        detectorRef.current = new window.FaceDetector({
          fastMode: true,
          maxDetectedFaces: 1,
        });
        setSupported(true);
      } catch {
        setSupported(false);
      }
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // 감지 루프
  useEffect(() => {
    const video = videoElRef ? videoElRef.current : null;
    if (!active || !video || !detectorRef.current) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let running = true;
    let lostCount = 0; // 연속 미감지 횟수

    const detect = async () => {
      if (!running) return;

      try {
        if (video.readyState >= 2) {
          const faces = await detectorRef.current.detect(video);

          if (faces.length > 0) {
            lostCount = 0;
            const bb = faces[0].boundingBox;
            const vw = video.videoWidth;
            const vh = video.videoHeight;
            const cw = video.clientWidth;
            const ch = video.clientHeight;

            if (vw > 0 && vh > 0 && cw > 0 && ch > 0) {
              // ─── object-fit:cover 좌표 변환 ───
              const videoAR = vw / vh;
              const displayAR = cw / ch;

              let scale, offX, offY;
              if (videoAR > displayAR) {
                // 비디오가 더 넓음 → 좌우 잘림
                scale = ch / vh;
                offX = (vw * scale - cw) / 2;
                offY = 0;
              } else {
                // 비디오가 더 높음 → 상하 잘림
                scale = cw / vw;
                offX = 0;
                offY = (vh * scale - ch) / 2;
              }

              // 비디오 픽셀 → 화면 픽셀
              let sx = bb.x * scale - offX;
              let sy = bb.y * scale - offY;
              let sw = bb.width * scale;
              let sh = bb.height * scale;

              // scaleX(-1) 미러 보정
              sx = cw - sx - sw;

              // 화면 비율 (0~1)
              const raw = {
                x: sx / cw,
                y: sy / ch,
                w: sw / cw,
                h: sh / ch,
              };

              // 보간으로 떨림 방지
              if (lastRef.current) {
                const p = lastRef.current;
                const s = {
                  x: lerp(p.x, raw.x, SMOOTH),
                  y: lerp(p.y, raw.y, SMOOTH),
                  w: lerp(p.w, raw.w, SMOOTH),
                  h: lerp(p.h, raw.h, SMOOTH),
                };
                lastRef.current = s;
                setFaceBox(s);
              } else {
                lastRef.current = raw;
                setFaceBox(raw);
              }
            }
          } else {
            // 얼굴 사라짐 → 10프레임 후 null
            lostCount++;
            if (lostCount > 10) {
              lastRef.current = null;
              setFaceBox(null);
            }
          }
        }
      } catch {}

      if (running) {
        animRef.current = requestAnimationFrame(detect);
      }
    };

    const timer = setTimeout(() => detect(), 500);

    return () => {
      running = false;
      clearTimeout(timer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, videoElRef]);

  return { faceBox, supported };
}

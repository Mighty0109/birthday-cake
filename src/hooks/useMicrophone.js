import { useState, useRef, useCallback, useEffect } from "react";

// ============================================================
// 🎤 마이크 + 바람 감지 훅
// ============================================================

export function useMicrophone({ onDone, failCount, setFailCount }) {
  const [blowIntensity, setBlowIntensity] = useState(0);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const blowAccRef = useRef(0);
  const animRef = useRef(null);

  // stale closure 방지용 ref
  const onDoneRef = useRef(onDone);
  const failCountRef = useRef(failCount);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);
  useEffect(() => { failCountRef.current = failCount; }, [failCount]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      an.smoothingTimeConstant = 0.3;
      src.connect(an);
      analyserRef.current = an;
      return true;
    } catch {
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startDetection = useCallback(() => {
    const an = analyserRef.current;
    if (!an) return;
    const arr = new Uint8Array(an.frequencyBinCount);
    let blowStartTime = 0;
    let isBlowing = false;
    let lastBlowTime = 0; // 마지막으로 바람 감지된 시간

    const detect = () => {
      an.getByteFrequencyData(arr);
      let sum = 0;
      const bins = Math.floor(arr.length * 0.3);
      for (let i = 0; i < bins; i++) sum += arr[i];
      const avg = sum / bins / 255;

      const now = Date.now();

      if (avg > 0.15) {
        // 바람 감지
        lastBlowTime = now;
        if (!isBlowing) {
          isBlowing = true;
          blowStartTime = now;
        }
        const elapsed = (now - blowStartTime) / 1000;
        const progress = Math.min(1, elapsed / 1.0);
        setBlowIntensity(progress);

        if (elapsed >= 1.0) {
          // 1.5초 이상 → 완료!
          if (animRef.current) cancelAnimationFrame(animRef.current);
          onDoneRef.current();
          return;
        }
      } else {
        // 바람 없음 - 0.3초 여유 (순간 끊김 허용)
        if (isBlowing && (now - lastBlowTime) > 300) {
          isBlowing = false;
          blowStartTime = 0;
        }
        // 서서히 게이지 감소
        blowAccRef.current = Math.max(0, (blowAccRef.current || 0) - 0.02);
        setBlowIntensity(blowAccRef.current);
        if (blowAccRef.current <= 0 && failCountRef.current < 3 && Math.random() < 0.005) {
          setFailCount((f) => f + 1);
        }
      }
      animRef.current = requestAnimationFrame(detect);
    };
    detect();
  }, [setFailCount]);

  return { blowIntensity, start, startDetection, stop };
}

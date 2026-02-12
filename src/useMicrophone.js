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

  // 항상 최신 값을 참조하기 위한 ref (stale closure 방지)
  const onDoneRef = useRef(onDone);
  const failCountRef = useRef(failCount);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);
  useEffect(() => { failCountRef.current = failCount; }, [failCount]);

  const start = useCallback(async (existingStream) => {
    try {
      const stream = existingStream || await navigator.mediaDevices.getUserMedia({ audio: true });
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
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  }, []);

  const startDetection = useCallback(() => {
    const an = analyserRef.current;
    if (!an) return;
    const arr = new Uint8Array(an.frequencyBinCount);

    const detect = () => {
      an.getByteFrequencyData(arr);
      let sum = 0;
      const bins = Math.floor(arr.length * 0.3);
      for (let i = 0; i < bins; i++) sum += arr[i];
      const avg = sum / bins / 255;

      if (avg > 0.35) {
        blowAccRef.current += avg * 0.08;
        setBlowIntensity(Math.min(1, blowAccRef.current));
        if (blowAccRef.current >= 1) {
          if (animRef.current) cancelAnimationFrame(animRef.current);
          if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
          onDoneRef.current();
          return;
        }
      } else {
        blowAccRef.current = Math.max(0, blowAccRef.current - 0.02);
        setBlowIntensity(Math.max(0, blowAccRef.current));
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

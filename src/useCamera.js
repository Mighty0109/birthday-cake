import { useRef, useState, useCallback } from "react";

// ============================================================
// 📷 전면 카메라 훅 (독립 스트림)
// ============================================================

export function useCamera() {
  const videoElRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      setActive(true);
      if (videoElRef.current) {
        videoElRef.current.srcObject = stream;
        videoElRef.current.play().catch(() => {});
      }
      return true;
    } catch {
      setActive(false);
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setActive(false);
  }, []);

  // callback ref - video 엘리먼트 마운트 시 자동 연결
  const videoRef = useCallback((el) => {
    videoElRef.current = el;
    if (el && streamRef.current && !el.srcObject) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  }, []);

  return { videoRef, active, start, stop };
}

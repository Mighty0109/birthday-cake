import { useState, useEffect, useCallback } from "react";

// ============================================================
// 📱 자이로스코프 훅
// ============================================================

export function useGyroscope() {
  const [tiltX, setTiltX] = useState(0);
  const [hasGyro, setHasGyro] = useState(false);

  const handler = useCallback((e) => {
    const g = e.gamma || 0;
    if (Math.abs(g) > 0.5) {
      setHasGyro(true);
      setTiltX(Math.max(-30, Math.min(30, g)));
    }
  }, []);

  useEffect(() => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ - requestPermission 필요
    } else {
      window.addEventListener("deviceorientation", handler);
    }
    return () => window.removeEventListener("deviceorientation", handler);
  }, [handler]);

  const requestPermission = useCallback(async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const perm = await DeviceOrientationEvent.requestPermission();
        if (perm === "granted") {
          window.addEventListener("deviceorientation", handler);
        }
      } catch {}
    }
  }, [handler]);

  // 터치 기반 기울기 fallback (자이로 없을 때)
  useEffect(() => {
    const onTouch = (e) => {
      if (hasGyro) return;
      const touch = e.touches[0];
      if (!touch) return;
      const x = touch.clientX;
      const w = window.innerWidth;
      const ratio = (x - w / 2) / (w / 2); // -1 ~ 1
      setTiltX(ratio * 20);
    };
    const onEnd = () => {
      if (!hasGyro) setTiltX(0);
    };
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onEnd);
    };
  }, [hasGyro]);

  return { tiltX, hasGyro, requestPermission };
}

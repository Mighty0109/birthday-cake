import { useState, useEffect, useCallback } from "react";

// ============================================================
// 📱 자이로스코프 훅
// ============================================================

export function useGyroscope() {
  const [tiltX, setTiltX] = useState(0);
  const [hasGyro, setHasGyro] = useState(false);
  const gyroGranted = { current: false };

  const handler = useCallback((e) => {
    const g = e.gamma || 0;
    if (Math.abs(g) > 0.5) {
      setHasGyro(true);
      gyroGranted.current = true;
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
          gyroGranted.current = true;
          window.addEventListener("deviceorientation", handler);
        }
      } catch {}
    }
  }, [handler]);

  // 자이로 없으면: 자동 흔들림 애니메이션
  useEffect(() => {
    let frame = null;
    let active = false;
    const timer = setTimeout(() => {
      if (gyroGranted.current) return;
      active = true;
      const sway = () => {
        if (!active || gyroGranted.current) return;
        const t = Date.now() / 1000;
        const val = Math.sin(t * 1.2) * 6 + Math.sin(t * 2.7) * 3;
        setTiltX(val);
        frame = requestAnimationFrame(sway);
      };
      sway();
    }, 2000);
    return () => {
      clearTimeout(timer);
      active = false;
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { tiltX, hasGyro, requestPermission };
}

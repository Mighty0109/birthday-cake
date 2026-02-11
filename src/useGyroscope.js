import { useState, useEffect, useCallback } from "react";

// ============================================================
// 📱 자이로스코프 훅
// ============================================================

export function useGyroscope() {
  const [tiltX, setTiltX] = useState(0);
  const [hasGyro, setHasGyro] = useState(false);

  const handler = useCallback((e) => {
    setHasGyro(true);
    setTiltX(Math.max(-30, Math.min(30, e.gamma || 0)));
  }, []);

  useEffect(() => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ - requestPermission 필요, handleIntroTap에서 호출
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

  return { tiltX, hasGyro, requestPermission };
}

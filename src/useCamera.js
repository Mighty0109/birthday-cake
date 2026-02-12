import { useRef, useCallback } from "react";

// ============================================================
// 📷 전면 카메라 훅 (스트림은 외부에서 관리)
// ============================================================

export function useCamera() {
  const streamRef = useRef(null);
  const videoElRef = useRef(null);

  // 스트림 저장 + 이미 마운트된 video가 있으면 연결
  const attach = useCallback((stream) => {
    streamRef.current = stream;
    if (videoElRef.current) {
      videoElRef.current.srcObject = stream;
      videoElRef.current.play().catch(() => {});
    }
  }, []);

  // callback ref: video 엘리먼트가 마운트/언마운트될 때 호출
  const videoRef = useCallback((el) => {
    videoElRef.current = el;
    if (el && streamRef.current && !el.srcObject) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  }, []);

  return { videoRef, attach };
}

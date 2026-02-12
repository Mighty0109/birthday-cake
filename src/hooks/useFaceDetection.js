import { useState, useEffect, useRef } from "react";

// ============================================================
// 👤 얼굴 감지 훅
// Chrome: FaceDetector API → 실시간 트래킹
// Safari: DEFAULT_FACE → 셀카 기본 위치 fallback
// ============================================================

var DEFAULT_FACE = { x: 0.3, y: 0.12, w: 0.4, h: 0.32 };

export function useFaceDetection(videoElRef, active) {
  var _s1 = useState(null), faceBox = _s1[0], setFaceBox = _s1[1];
  var _s2 = useState(false), tracking = _s2[0], setTracking = _s2[1];
  var detectorRef = useRef(null);
  var animRef = useRef(null);
  var lastRef = useRef(null);
  var hasAPI = useRef(false);

  function lerp(a, b, t) { return a + (b - a) * t; }

  useEffect(function() {
    if (typeof window.FaceDetector === "function") {
      try {
        detectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        hasAPI.current = true;
      } catch(e) { hasAPI.current = false; }
    }
    return function() { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  useEffect(function() {
    if (!active) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setFaceBox(null); lastRef.current = null; setTracking(false);
      return;
    }
    if (!hasAPI.current) {
      setFaceBox(DEFAULT_FACE); setTracking(false); return;
    }
    var video = videoElRef ? videoElRef.current : null;
    if (!video) { setFaceBox(DEFAULT_FACE); return; }

    var running = true, lost = 0;
    function tick() {
      if (!running) return;
      (async function() {
        try {
          if (video.readyState >= 2 && detectorRef.current) {
            var faces = await detectorRef.current.detect(video);
            if (faces.length > 0) {
              lost = 0; setTracking(true);
              var bb = faces[0].boundingBox;
              var vw = video.videoWidth, vh = video.videoHeight;
              var cw = video.clientWidth, ch = video.clientHeight;
              if (vw > 0 && vh > 0 && cw > 0 && ch > 0) {
                var vAR = vw / vh, dAR = cw / ch;
                var sc, ox, oy;
                if (vAR > dAR) { sc = ch / vh; ox = (vw * sc - cw) / 2; oy = 0; }
                else { sc = cw / vw; ox = 0; oy = (vh * sc - ch) / 2; }
                var sx = cw - (bb.x * sc - ox) - bb.width * sc;
                var sy = bb.y * sc - oy;
                var sw = bb.width * sc, sh = bb.height * sc;
                var raw = { x: sx / cw, y: sy / ch, w: sw / cw, h: sh / ch };
                if (lastRef.current) {
                  var p = lastRef.current;
                  var s = { x: lerp(p.x,raw.x,0.25), y: lerp(p.y,raw.y,0.25), w: lerp(p.w,raw.w,0.25), h: lerp(p.h,raw.h,0.25) };
                  lastRef.current = s; setFaceBox(s);
                } else { lastRef.current = raw; setFaceBox(raw); }
              }
            } else { lost++; if (lost > 15) { setTracking(false); lastRef.current = null; setFaceBox(DEFAULT_FACE); } }
          }
        } catch(e) {}
        if (running) animRef.current = requestAnimationFrame(tick);
      })();
    }
    var t = setTimeout(tick, 500);
    return function() { running = false; clearTimeout(t); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active, videoElRef]);

  return { faceBox: faceBox, tracking: tracking };
}

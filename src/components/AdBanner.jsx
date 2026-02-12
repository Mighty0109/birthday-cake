import { useState, useEffect, useRef } from "react";

// ============================================================
// 💰 Google AdSense 배너
// ============================================================

export function AdBanner({ slot = "XXXXXXXXXX", format = "auto", style = {} }) {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [adReady, setAdReady] = useState(false);

  useEffect(() => {
    if (window.adsbygoogle && !pushed.current) {
      setAdReady(true);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.log("AdSense error:", e);
      }
    }
  }, []);

  if (!adReady) return null;

  return (
    <div style={{ width: "100%", maxWidth: 360, margin: "16px auto", textAlign: "center", overflow: "hidden", ...style }}>
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{ display: "block" }}
        data-ad-client="ca-pub-3089729030829076"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

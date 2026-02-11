import { useState, useEffect } from "react";
import { globalStyles } from "./constants/theme";
import { decodeData } from "./utils/codec";
import { CreatePage } from "./pages/CreatePage";
import { ViewPage } from "./pages/ViewPage";

// ============================================================
// 🎂 "촛불 끄셈 ㅋㅋ" - 2026 WARM RETRO EDITION
// ============================================================

export default function App() {
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    const parseHash = (hash) => {
      if (hash.startsWith("#cake=")) {
        const d = decodeData(hash.slice(6));
        if (d && d.n && d.a) return d;
      }
      return null;
    };

    setViewData(parseHash(window.location.hash));

    const onHash = () => {
      setViewData(parseHash(window.location.hash));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      {viewData ? <ViewPage data={viewData} /> : <CreatePage />}
    </>
  );
}

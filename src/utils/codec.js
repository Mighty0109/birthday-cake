// ============================================================
// 🔗 URL 데이터 인코딩/디코딩
// ============================================================

export function encodeData(obj) {
  try {
    return btoa(
      encodeURIComponent(JSON.stringify(obj)).replace(
        /%([0-9A-F]{2})/g,
        (_, p1) => String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch {
    return "";
  }
}

export function decodeData(str) {
  try {
    return JSON.parse(
      decodeURIComponent(
        Array.from(atob(str))
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    return null;
  }
}

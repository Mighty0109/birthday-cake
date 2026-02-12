// ============================================================
// 🎂 나이별 케이크 테마
// ============================================================

export function getCakeTheme(age) {
  if (age <= 12)
    return { cake: "#F4B8C1", cake2: "#E899A4", frost: "#FFF5DC", plate: "#D4A574", label: "귀요미 케이크", accent: "#E8722A" };
  if (age <= 19)
    return { cake: "#B8D4A8", cake2: "#8FA77A", frost: "#FFF8EE", plate: "#8B7355", label: "급식 특별 케이크", accent: "#D4A535" };
  if (age <= 29)
    return { cake: "#D4A535", cake2: "#B8892A", frost: "#FFF8EE", plate: "#6B4226", label: "힙한 빈티지 케이크", accent: "#E8722A" };
  if (age <= 39)
    return { cake: "#C4694A", cake2: "#A85535", frost: "#FFF5DC", plate: "#4A3020", label: "인생 반환점 케이크", accent: "#D4847C" };
  return { cake: "#8B3A3A", cake2: "#6B2A2A", frost: "#E8722A", plate: "#3A2010", label: "소방관 출동 케이크", accent: "#D4A535" };
}

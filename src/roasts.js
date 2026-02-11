// ============================================================
// 🔥 B급 드립 & 연기 코멘트
// ============================================================

export const ROASTS = {
  child: [
    "우와~ 벌써 {age}살이야?! 다 컸네!! ☆",
    "{age}살 축하해! 산타 아직 믿지?",
    "짝짝짝! {age}살 되셨습니다~",
  ],
  teen: [
    "{age}살 ㅊㅋ~ 사춘기 파이팅 ㅋ",
    "중2병은 나았어? {age}살 축하 ㅋ",
    "{age}살이면... 아직 급식충? ㅋㅋ",
  ],
  twenty: [
    "{age}살 축하~ MZ세대 등록 완료",
    "이제 {age}살이면 중고신입 ㅋㅋ",
    "{age}번째 생존 축하 ㅋ 대출 화이팅",
    "{age}살? 벌써 아재 소리 들을 나이",
  ],
  thirty: [
    "{age}살 ㅊㅋ... 무릎 조심해 ㅎ",
    "30대 입장~ {age}살 건강검진 필수",
    "{age}살이면 요즘것들 시전 가능 ㅋ",
    "축하합니다 {age}살! 10시면 졸리죠?",
  ],
  forty: [
    "{age}살 축하드립니다 선배님...",
    "불이 너무 많아서 소방서 신고할뻔",
    "{age}개의 초... 케이크가 불바다 ㅋ",
    "{age}살 축하! 건강이 최고 진짜로",
  ],
  fifty: [
    "소방차 출동!! {age}살 생축!!",
    "{age}살?! 레전드... 존경합니다",
    "초 {age}개는 화재 위험 ㅋㅋㅋ",
    "{age}번째 생일 축하 대선배님!!",
  ],
};

export function getRoast(age) {
  let cat;
  if (age <= 12) cat = "child";
  else if (age <= 19) cat = "teen";
  else if (age <= 29) cat = "twenty";
  else if (age <= 39) cat = "thirty";
  else if (age <= 49) cat = "forty";
  else cat = "fifty";
  const list = ROASTS[cat];
  return list[Math.floor(Math.random() * list.length)].replace("{age}", age);
}

export function getSmokeComment(age) {
  if (age <= 5) return "💨 후~ 살짝 연기남";
  if (age <= 15) return "💨💨 연기 좀 나네~";
  if (age <= 25) return "💨💨💨 연기 꽤 나는데...?";
  if (age <= 40) return "🌫️ 헉 연기 장난 아닌데;;;";
  if (age <= 60) return "🚨 화재 아닙니다 화재 아닙니다";
  if (age <= 80) return "🧯 119 부를까...?";
  return "☁️ 여기 구름 낀 거 아님?? 케이크에서 나는 거임";
}

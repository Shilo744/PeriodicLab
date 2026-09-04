import { Locale } from './i18n';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.periodiclab.app';

export function buildDailyShareMessage(name: string, symbol: string, atomicNumber: number, locale: Locale): string {
  if (locale === 'he') {
    return `יסוד היום שלי במעבדה המחזורית הוא ${name} (${symbol}), מספר אטומי ${atomicNumber}. תוכלו לשלוט בו גם? ${PLAY_STORE_URL}`;
  }
  return `Today's Periodic Lab element is ${name} (${symbol}), atomic number ${atomicNumber}. Can you master it too? ${PLAY_STORE_URL}`;
}

export function buildBlitzShareMessage(score: number, bestCombo: number, locale: Locale): string {
  const safeScore = Math.max(0, Math.trunc(score));
  const safeCombo = Math.max(0, Math.trunc(bestCombo));
  if (locale === 'he') {
    return `זיהיתי ${safeScore} יסודות ב־60 שניות והשגתי רצף של ${safeCombo} במעבדה המחזורית. תוכלו לעבור את התוצאה שלי? ${PLAY_STORE_URL}`;
  }
  return `I identified ${safeScore} elements in 60 seconds with a best combo of ${safeCombo} in Periodic Lab. Can you beat my score? ${PLAY_STORE_URL}`;
}

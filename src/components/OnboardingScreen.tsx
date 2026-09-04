import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS } from '../theme';
import { Locale } from '../data/i18n';

const COPY = {
  en: [
    { icon: '⚛️', eyebrow: 'WELCOME, SCIENTIST', title: 'Chemistry you can touch', body: 'Explore all 118 elements through atoms, isotopes, spectra, phase changes, and a searchable periodic table.' },
    { icon: '🧪', eyebrow: 'LEARN BY DOING', title: 'Build, react, remember', body: 'Construct atoms, inspect balanced reactions, then lock in what you learned with quizzes and focused flashcards.' },
    { icon: '🔥', eyebrow: 'A REASON TO RETURN', title: 'Your daily research mission', body: 'Discover the featured element, earn XP, build a streak, unlock chapters, and share your find with friends.' },
  ],
  he: [
    { icon: '⚛️', eyebrow: 'ברוכים הבאים, מדענים', title: 'כימיה שאפשר לגעת בה', body: 'חקרו את כל 118 היסודות דרך אטומים, איזוטופים, ספקטרום, מעברי פאזה וטבלה מחזורית חכמה.' },
    { icon: '🧪', eyebrow: 'לומדים דרך עשייה', title: 'בונים, מגיבים וזוכרים', body: 'בנו אטומים, בדקו תגובות מאוזנות, ואז חזקו את הידע בחידונים ובכרטיסיות ממוקדות.' },
    { icon: '🔥', eyebrow: 'סיבה לחזור בכל יום', title: 'משימת המחקר היומית', body: 'גלו את יסוד היום, צברו XP ורצף, פתחו פרקים ושתפו את התגלית עם חברים.' },
  ],
} as const;

export default function OnboardingScreen({ locale, onLocaleChange, onComplete }: { locale: Locale; onLocaleChange: (locale: Locale) => void; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const page = COPY[locale][step];
  const isHebrew = locale === 'he';
  const last = step === COPY.en.length - 1;

  return (
    <View style={O.root} accessibilityViewIsModal>
      <LinearGradient colors={['#111a46', '#0a0e1a', '#07111f']} style={StyleSheet.absoluteFill} />
      <View style={O.topRow}>
        <Text style={O.brand}>PERIODIC LAB</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={isHebrew ? 'Switch to English' : 'החלפה לעברית'} style={O.language} onPress={() => onLocaleChange(isHebrew ? 'en' : 'he')}>
          <Text style={O.languageText}>{isHebrew ? 'English' : 'עברית'}</Text>
        </TouchableOpacity>
      </View>

      <View style={O.content}>
        <View style={O.iconHalo}><Text style={O.icon}>{page.icon}</Text></View>
        <Text style={[O.eyebrow, isHebrew && O.rtl]}>{page.eyebrow}</Text>
        <Text style={[O.title, isHebrew && O.rtl]}>{page.title}</Text>
        <Text style={[O.body, isHebrew && O.rtl]}>{page.body}</Text>
      </View>

      <View style={O.footer}>
        <View style={O.dots} accessibilityLabel={`Step ${step + 1} of ${COPY.en.length}`}>
          {COPY.en.map((_, index) => <View key={index} style={[O.dot, index === step && O.dotActive]} />)}
        </View>
        <TouchableOpacity accessibilityRole="button" style={O.primary} onPress={() => last ? onComplete() : setStep(value => value + 1)}>
          <LinearGradient colors={['#6366f1', '#22d3ee']} style={O.primaryGradient}>
            <Text style={O.primaryText}>{last ? (isHebrew ? 'מתחילים לחקור' : 'Enter the lab') : (isHebrew ? 'המשך' : 'Continue')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        {step > 0 && <TouchableOpacity accessibilityRole="button" style={O.back} onPress={() => setStep(value => value - 1)}><Text style={O.backText}>{isHebrew ? 'חזרה' : 'Back'}</Text></TouchableOpacity>}
      </View>
    </View>
  );
}

const O = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 24, paddingTop: 54, paddingBottom: 34 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#a5b4fc', fontWeight: '900', fontSize: 13, letterSpacing: 2 },
  language: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 8, minHeight: 44, justifyContent: 'center' },
  languageText: { color: COLORS.text, fontWeight: '800', fontSize: 12 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', maxWidth: 560, alignSelf: 'center' },
  iconHalo: { width: 132, height: 132, borderRadius: 66, backgroundColor: 'rgba(99,102,241,0.18)', borderWidth: 1, borderColor: 'rgba(34,211,238,0.45)', alignItems: 'center', justifyContent: 'center', marginBottom: 34, ...SHADOWS.glow },
  icon: { fontSize: 62 },
  eyebrow: { color: '#22d3ee', fontSize: 11, fontWeight: '900', letterSpacing: 1.8, textAlign: 'center' },
  title: { color: COLORS.text, fontSize: 32, lineHeight: 39, fontWeight: '900', textAlign: 'center', marginTop: 12 },
  body: { color: COLORS.textSecondary, fontSize: 16, lineHeight: 25, textAlign: 'center', marginTop: 16 },
  rtl: { writingDirection: 'rtl' },
  footer: { alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#334155' },
  dotActive: { width: 28, backgroundColor: '#22d3ee' },
  primary: { width: '100%', maxWidth: 480, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.glow },
  primaryGradient: { minHeight: 56, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  back: { minHeight: 44, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  backText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },
});

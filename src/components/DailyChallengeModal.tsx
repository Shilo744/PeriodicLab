import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDailyChallenge } from '../data/dailyChallenge';
import { getElement } from '../data/elements';
import { Locale } from '../data/i18n';
import { COLORS, RADIUS, SHADOWS } from '../theme';

interface Props {
  visible: boolean;
  completed: boolean;
  locale: Locale;
  onClose: () => void;
  onComplete: (z: number) => void;
}

export default function DailyChallengeModal({ visible, completed, locale, onClose, onComplete }: Props) {
  const challenge = useMemo(() => getDailyChallenge(), [visible]);
  const element = getElement(challenge.z);
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === challenge.correctIndex;
  const hebrewQuestion = {
    'atomic-number': `מהו המספר האטומי של ${element.nameEn} (${element.sym})?`,
    category: `לאיזו משפחה או קטגוריה שייך ${element.nameEn}?`,
    state: `מהו מצב הצבירה הרגיל של ${element.nameEn} בתנאים תקניים?`,
    'valence-electrons': `כמה אלקטרונים נמצאים בקליפה החיצונית של ${element.nameEn}?`,
  }[challenge.kind];

  useEffect(() => {
    if (visible) setSelected(null);
  }, [visible, challenge.dateStr]);

  const choose = (index: number) => {
    if (isCorrect) return;
    setSelected(index);
  };

  const close = () => {
    setSelected(null);
    onClose();
  };

  return <Modal transparent animationType="fade" visible={visible} onRequestClose={close}>
    <View style={S.backdrop}>
      <View style={S.card}>
        <LinearGradient colors={['rgba(251,191,36,0.15)', 'rgba(17,24,39,0.98)']} style={StyleSheet.absoluteFill} />
        <View style={S.header}><Text style={S.atom}>{element.sym}</Text><View style={{ flex: 1 }}><Text style={S.tag}>{locale === 'he' ? 'אתגר הזיכרון היומי' : 'DAILY RECALL'}</Text><Text style={S.title}>{locale === 'he' ? `היסוד של היום: ${element.nameEn}` : `Today's element: ${element.nameEn}`}</Text></View></View>
        <Text style={S.question}>{locale === 'he' ? hebrewQuestion : challenge.question}</Text>
        <View style={S.options}>{challenge.options.map((answer, index) => {
          const chosen = selected === index;
          const correct = index === challenge.correctIndex;
          return <TouchableOpacity key={answer} accessibilityRole="button" accessibilityLabel={`${answer}`} onPress={() => choose(index)} activeOpacity={0.8} style={[S.option, chosen && (correct ? S.correct : S.wrong)]}>
            <Text style={S.optionText}>{answer}</Text>
          </TouchableOpacity>;
        })}</View>
        {selected !== null && <Text accessibilityLiveRegion="polite" style={[S.feedback, isCorrect ? S.feedbackCorrect : S.feedbackWrong]}>{isCorrect
          ? (locale === 'he' ? `נכון! התשובה היא ${challenge.options[challenge.correctIndex]}. ${element.desc}` : challenge.explanation)
          : (locale === 'he' ? 'לא בדיוק — נסו שוב.' : 'Not quite — try again.')}</Text>}
        <Text style={S.reward}>{completed ? (locale === 'he' ? 'כבר השלמתם היום · אפשר לתרגל שוב' : 'Completed today · replay for practice') : (locale === 'he' ? 'תשובה נכונה פותחת את הסיפור ומעניקה 100+ XP' : 'A correct answer unlocks the story and +100 XP')}</Text>
        {isCorrect && <TouchableOpacity onPress={() => onComplete(challenge.z)} style={S.continueButton} accessibilityRole="button"><Text style={S.continueText}>{completed ? (locale === 'he' ? 'לסיפור של היסוד' : 'Review element story') : (locale === 'he' ? 'קבלת הפרס ולסיפור' : 'Claim reward & explore')}</Text></TouchableOpacity>}
        <TouchableOpacity onPress={close} style={S.close} accessibilityRole="button"><Text style={S.closeText}>{locale === 'he' ? 'סגירה' : 'Close'}</Text></TouchableOpacity>
      </View>
    </View>
  </Modal>;
}

const S = StyleSheet.create({
  backdrop: { flex: 1, padding: 22, justifyContent: 'center', backgroundColor: 'rgba(2,6,23,0.84)' },
  card: { overflow: 'hidden', padding: 20, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: 'rgba(251,191,36,0.45)', backgroundColor: COLORS.surface, ...SHADOWS.glow },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  atom: { width: 58, height: 58, textAlign: 'center', textAlignVertical: 'center', borderRadius: RADIUS.md, backgroundColor: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontSize: 24, fontWeight: '900' },
  tag: { color: '#fbbf24', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: COLORS.text, fontSize: 19, fontWeight: '900', marginTop: 4 },
  question: { color: COLORS.text, fontSize: 17, fontWeight: '800', lineHeight: 24, marginTop: 22 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 16 },
  option: { width: '48%', minHeight: 52, paddingHorizontal: 5, paddingVertical: 14, justifyContent: 'center', alignItems: 'center', borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'rgba(148,163,184,0.25)', backgroundColor: 'rgba(255,255,255,0.04)' },
  correct: { borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.14)' },
  wrong: { borderColor: '#fb7185', backgroundColor: 'rgba(251,113,133,0.12)' },
  optionText: { color: COLORS.text, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  feedback: { marginTop: 16, fontSize: 12, lineHeight: 18, fontWeight: '700' },
  feedbackCorrect: { color: '#6ee7b7' },
  feedbackWrong: { color: '#fda4af' },
  reward: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 14 },
  continueButton: { alignItems: 'center', paddingVertical: 13, marginTop: 14, borderRadius: RADIUS.md, backgroundColor: '#d97706' },
  continueText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  close: { alignSelf: 'center', paddingHorizontal: 18, paddingVertical: 10, marginTop: 10 },
  closeText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '800' },
});

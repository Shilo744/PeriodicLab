import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getElement } from '../data/elements';
import { COLORS, RADIUS, getCategoryColor, SHADOWS } from '../theme';
import Atom3D from '../components/Atom3D';
import { LinearGradient } from 'expo-linear-gradient';
import { QUIZZES, Question } from '../data/quiz';
import { triggerHaptic, playSound } from '../services/feedback';

const { height: H } = Dimensions.get('window');

function getDistractors(correctZ: number, pool: number[]): number[] {
  const correct = getElement(correctZ);
  const sameCat = pool.filter(z => z !== correctZ && getElement(z).category === correct.category);
  const others = pool.filter(z => z !== correctZ && !sameCat.includes(z));
  
  const candidates = [...sameCat, ...others];
  if (candidates.length < 3) {
    const fallbacks = Array.from({ length: 118 }, (_, i) => i + 1)
      .filter(z => z !== correctZ && !candidates.includes(z))
      .sort(() => Math.random() - 0.5);
    candidates.push(...fallbacks);
  }

  const all = candidates.sort(() => Math.random() - 0.5);
  const unique = new Set<number>();
  for (const z of all) { unique.add(z); if (unique.size >= 3) break; }
  return [...unique].sort(() => Math.random() - 0.5);
}

function xpForLevel(level: number): number { return 10 + level * 5; }

type QuizMode = '3d_atom' | 'trivia';

import SpeedBlitzScreen from './SpeedBlitzScreen';

export default function QuizScreen({
  z, elementLevels, discovered, pool,
  onCorrect, onNext,
}: {
  z: number; elementLevels: Record<number, number>; discovered: number[];
  pool: number[]; onCorrect: (z: number) => void; onNext: () => void;
}) {
  const [mode, setMode] = useState<QuizMode>('3d_atom');
  const [showBlitz, setShowBlitz] = useState(false);
  const [triviaCategory, setTriviaCategory] = useState<string>('all');
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [state, setState] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const locked = useRef(false);
  const timerRef = useRef<any>(null);

  const filteredQuizzes = React.useMemo(() => {
    if (triviaCategory === 'all') return QUIZZES;
    return QUIZZES.filter(q => q.category === triviaCategory);
  }, [triviaCategory]);

  const activeTriviaList = filteredQuizzes.length > 0 ? filteredQuizzes : QUIZZES;
  const currentTrivia: Question = activeTriviaList[triviaIndex % activeTriviaList.length];
  const el = getElement(z);
  const cat = getCategoryColor(el.category);

  // 3D Atom Options
  const atomOptions = React.useMemo(() => {
    const dists = getDistractors(z, pool);
    return [z, ...dists].sort(() => Math.random() - 0.5);
  }, [z, pool]);

  // Countdown timer for speed bonus
  useEffect(() => {
    if (state !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [z, triviaIndex, mode, state]);

  // Multiplier based on streak
  const streakMultiplier = streak >= 5 ? 2.5 : streak >= 3 ? 2.0 : streak >= 1 ? 1.5 : 1.0;
  const speedBonus = timeLeft > 10 ? 15 : timeLeft > 5 ? 10 : timeLeft > 0 ? 5 : 0;
  const level = elementLevels[z] || 0;
  const baseXP = mode === '3d_atom' ? xpForLevel(level) : currentTrivia.rewardPoints;
  const totalEarnedXP = Math.round(baseXP * streakMultiplier) + speedBonus;

  // Handle 3D atom guess
  const handleAtomGuess = useCallback((guessZ: number) => {
    if (locked.current) return;
    locked.current = true;
    setSelectedOpt(guessZ);
    if (timerRef.current) clearInterval(timerRef.current);

    if (guessZ === z) {
      triggerHaptic('success');
      playSound('success');
      setState('correct');
      setStreak(s => s + 1);
      setTimeout(() => {
        onCorrect(z);
        locked.current = false;
        setSelectedOpt(null);
        setState('playing');
      }, 2200);
    } else {
      triggerHaptic('error');
      playSound('error');
      setState('wrong');
      setStreak(0);
      setTimeout(() => {
        locked.current = false;
        setSelectedOpt(null);
        setState('playing');
        onNext();
      }, 2800);
    }
  }, [z, onCorrect, onNext]);

  // Handle trivia question guess
  const handleTriviaGuess = useCallback((optionIdx: number) => {
    if (locked.current) return;
    locked.current = true;
    setSelectedOpt(optionIdx);
    if (timerRef.current) clearInterval(timerRef.current);

    if (optionIdx === currentTrivia.correctIndex) {
      triggerHaptic('success');
      playSound('success');
      setState('correct');
      setStreak(s => s + 1);
      setTimeout(() => {
        onCorrect(z);
        setTriviaIndex(i => i + 1);
        locked.current = false;
        setSelectedOpt(null);
        setState('playing');
      }, 2400);
    } else {
      triggerHaptic('error');
      playSound('error');
      setState('wrong');
      setStreak(0);
      setTimeout(() => {
        setTriviaIndex(i => i + 1);
        locked.current = false;
        setSelectedOpt(null);
        setState('playing');
        onNext();
      }, 3000);
    }
  }, [currentTrivia, z, onCorrect, onNext]);

  const atomSize = H * 0.28;

  if (showBlitz) {
    return (
      <SpeedBlitzScreen
        onFinish={(score, gainedXP) => {
          setShowBlitz(false);
          onCorrect(z);
        }}
        onClose={() => setShowBlitz(false)}
      />
    );
  }

  return (
    <View style={Q.wrap}>
      {/* Header: Mode Selector & Live Streak Badge */}
      <View style={Q.headerRow}>
        <View style={Q.modeSwitch}>
          <TouchableOpacity 
            style={[Q.modeBtn, mode === '3d_atom' && Q.modeBtnActive]}
            onPress={() => { setMode('3d_atom'); setState('playing'); setSelectedOpt(null); }}
            activeOpacity={0.8}
          >
            <Text style={[Q.modeTxt, mode === '3d_atom' && Q.modeTxtActive]}>3D Atom</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[Q.modeBtn, mode === 'trivia' && Q.modeBtnActive]}
            onPress={() => { setMode('trivia'); setState('playing'); setSelectedOpt(null); }}
            activeOpacity={0.8}
          >
            <Text style={[Q.modeTxt, mode === 'trivia' && Q.modeTxtActive]}>Trivia</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[Q.modeBtn, { backgroundColor: 'rgba(244, 114, 182, 0.15)' }]}
            onPress={() => setShowBlitz(true)}
            activeOpacity={0.8}
          >
            <Text style={[Q.modeTxt, { color: '#f472b6', fontWeight: '800' }]}>⚡ Blitz</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Flame Badge */}
        <View style={[Q.streakBadge, streak > 0 && Q.streakBadgeActive]}>
          <Text style={Q.streakTxt}>
            {streak > 0 ? `🔥 ${streak}x (${streakMultiplier}x XP)` : '🔥 0 Streak'}
          </Text>
        </View>
      </View>

      {/* Speed Timer Bar */}
      <View style={Q.timerBarContainer}>
        <LinearGradient
          colors={timeLeft > 5 ? ['#34d399', '#60a5fa'] : ['#f87171', '#fbbf24']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[Q.timerFill, { width: `${(timeLeft / 15) * 100}%` }]}
        />
      </View>

      {mode === '3d_atom' ? (
        /* --- 3D Atom Identification Challenge --- */
        <>
          {/* Top Diagnostics Card */}
          <View style={Q.propsOverlay}>
            <LinearGradient colors={['rgba(10, 14, 26, 0.8)', 'rgba(10, 14, 26, 0.95)']} style={StyleSheet.absoluteFill} />
            <View style={Q.propRow}>
              <View style={Q.prop}><Text style={[Q.propVal, { color: '#ef4444' }]}>{z}</Text><Text style={Q.propLbl}>Protons</Text></View>
              <View style={Q.prop}><Text style={[Q.propVal, { color: '#60a5fa' }]}>{el.stableNeutrons}</Text><Text style={Q.propLbl}>Neutrons</Text></View>
              <View style={Q.prop}><Text style={[Q.propVal, { color: '#34d399' }]}>{z}</Text><Text style={Q.propLbl}>Electrons</Text></View>
              <View style={Q.prop}><Text style={[Q.propVal, { color: '#fbbf24' }]}>{el.mass.toFixed(2)}</Text><Text style={Q.propLbl}>Mass (u)</Text></View>
            </View>
          </View>

          {/* 3D Model Stage */}
          <View style={Q.atomFull}>
            <Atom3D protons={z} neutrons={el.stableNeutrons} electrons={z} size={atomSize} elementColor={el.color} />
          </View>

          {/* Element Choices Grid */}
          <View style={Q.answerGrid}>
            {atomOptions.map(opt => {
              const optEl = getElement(opt);
              const optCat = getCategoryColor(optEl.category);
              const isCorrect = opt === z;
              const isSelected = selectedOpt === opt;

              let bg = COLORS.bgCard;
              let bc = COLORS.border;
              let tc = optCat;

              if (state === 'correct' && isCorrect) { bg = 'rgba(52, 211, 153, 0.15)'; bc = 'rgba(52, 211, 153, 0.5)'; tc = '#34d399'; }
              else if (state === 'wrong' && isSelected && !isCorrect) { bg = 'rgba(239, 68, 68, 0.15)'; bc = 'rgba(239, 68, 68, 0.5)'; tc = '#ef4444'; }
              else if (state === 'wrong' && isCorrect) { bg = 'rgba(52, 211, 153, 0.15)'; bc = 'rgba(52, 211, 153, 0.5)'; tc = '#34d399'; }

              return (
                <TouchableOpacity key={opt}
                  style={[Q.optBtn, { backgroundColor: bg, borderColor: bc }]}
                  onPress={() => handleAtomGuess(opt)} activeOpacity={0.7} disabled={state !== 'playing'}>
                  <Text style={[Q.optSym, { color: tc }]}>{optEl.sym}</Text>
                  <Text style={Q.optName}>{optEl.nameEn}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : (
        /* --- Chemical Theory Trivia Challenge --- */
        <View style={Q.triviaContainer}>
          {/* Category Filter Chips */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            {['all', 'structure', 'trends', 'bonding', 'history', 'superheavy'].map(catKey => (
              <TouchableOpacity
                key={catKey}
                style={[
                  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.borderLight },
                  triviaCategory === catKey && { backgroundColor: 'rgba(99, 102, 241, 0.2)', borderColor: COLORS.primaryLight }
                ]}
                onPress={() => {
                  setTriviaCategory(catKey);
                  setTriviaIndex(0);
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: '800', color: triviaCategory === catKey ? COLORS.primaryLight : COLORS.textTertiary }}>
                  {catKey.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Question Card */}
          <View style={Q.questionCard}>
            <LinearGradient colors={['rgba(99, 102, 241, 0.08)', 'rgba(10, 14, 26, 0.4)']} style={StyleSheet.absoluteFill} />
            <View style={Q.questionBadge}>
              <Text style={Q.questionCategory}>{currentTrivia.category.toUpperCase()}</Text>
              <Text style={Q.questionDifficulty}>{'★'.repeat(currentTrivia.difficulty)}</Text>
            </View>
            <Text style={Q.questionText}>{currentTrivia.question}</Text>
          </View>

          {/* Multiple Choice Answers */}
          <View style={Q.triviaOptionsList}>
            {currentTrivia.options.map((optionText, idx) => {
              const isCorrect = idx === currentTrivia.correctIndex;
              const isSelected = selectedOpt === idx;

              let bg = 'rgba(255, 255, 255, 0.03)';
              let bc = COLORS.border;
              let tc = COLORS.text;

              if (state === 'correct' && isCorrect) { bg = 'rgba(52, 211, 153, 0.18)'; bc = '#34d399'; tc = '#34d399'; }
              else if (state === 'wrong' && isSelected && !isCorrect) { bg = 'rgba(239, 68, 68, 0.18)'; bc = '#ef4444'; tc = '#ef4444'; }
              else if (state === 'wrong' && isCorrect) { bg = 'rgba(52, 211, 153, 0.18)'; bc = '#34d399'; tc = '#34d399'; }

              return (
                <TouchableOpacity
                  key={idx}
                  style={[Q.triviaOptionBtn, { backgroundColor: bg, borderColor: bc }]}
                  onPress={() => handleTriviaGuess(idx)}
                  activeOpacity={0.7}
                  disabled={state !== 'playing'}
                >
                  <Text style={Q.optionIndex}>{String.fromCharCode(65 + idx)}</Text>
                  <Text style={[Q.optionText, { color: tc }]}>{optionText}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Educational Feedback Overlay */}
      {state !== 'playing' && (
        <View style={Q.fbOverlay}>
          <View style={Q.fbBox}>
            <LinearGradient colors={['rgba(10, 14, 26, 0.96)', 'rgba(10, 14, 26, 1.0)']} style={StyleSheet.absoluteFill} />
            {state === 'correct' ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={[Q.fbTitle, { color: '#34d399' }]}>Correct!</Text>
                <Text style={Q.fbXp}>+{totalEarnedXP} XP Gained</Text>
                {speedBonus > 0 && <Text style={Q.speedBonusText}>⚡ +{speedBonus} XP Speed Bonus!</Text>}
                
                {/* Science Explanation */}
                <View style={Q.explanationCard}>
                  <Text style={Q.explanationTitle}>SCIENTIFIC EXPLANATION</Text>
                  <Text style={Q.explanationText}>
                    {mode === '3d_atom'
                      ? `${el.nameEn} (${el.sym}) has Z=${z} protons, ${el.stableNeutrons} neutrons, and mass ${el.mass.toFixed(2)} u. ${el.desc}`
                      : currentTrivia.explanation}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={[Q.fbTitle, { color: '#ef4444' }]}>Incorrect</Text>
                <Text style={Q.fbAns}>
                  Correct: <Text style={{ color: cat, fontWeight: '800' }}>
                    {mode === '3d_atom' ? `${el.sym} (${el.nameEn})` : currentTrivia.options[currentTrivia.correctIndex]}
                  </Text>
                </Text>

                {/* Science Explanation */}
                <View style={Q.explanationCard}>
                  <Text style={Q.explanationTitle}>SCIENTIFIC EXPLANATION</Text>
                  <Text style={Q.explanationText}>
                    {mode === '3d_atom'
                      ? `Atomic number ${z} corresponds to ${el.nameEn} with ${el.electronConfig} configuration.`
                      : currentTrivia.explanation}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const Q = StyleSheet.create({
  wrap: { 
    flex: 1, 
    backgroundColor: COLORS.bg,
    paddingTop: 54,
    paddingBottom: 110,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.sm,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 4,
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm - 2,
  },
  modeBtnActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  modeTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  modeTxtActive: {
    color: COLORS.primaryLight,
  },

  streakBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  streakBadgeActive: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.35)',
  },
  streakTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fbbf24',
  },

  timerBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  timerFill: {
    height: '100%',
    borderRadius: 2,
  },

  // 3D Mode styles
  atomFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  propsOverlay: {
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
    zIndex: 10,
  },
  propRow: { flexDirection: 'row', justifyContent: 'space-around' },
  prop: { alignItems: 'center' },
  propVal: { fontSize: 16, fontWeight: '800' },
  propLbl: { fontSize: 8.5, color: COLORS.textSecondary, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.3 },

  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    zIndex: 10,
  },
  optBtn: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  optSym: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  optName: { fontSize: 9.5, color: COLORS.textSecondary, textAlign: 'center' },

  // Trivia Mode styles
  triviaContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  questionCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
    marginBottom: 12,
  },
  questionBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 0.8,
  },
  questionDifficulty: {
    fontSize: 10,
    color: '#fbbf24',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
  },
  triviaOptionsList: {
    gap: 8,
  },
  triviaOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    ...SHADOWS.card,
  },
  optionIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginRight: 10,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },

  // Feedback styles
  fbOverlay: {
    ...StyleSheet.absoluteFillObject as object,
    backgroundColor: 'rgba(10, 14, 26, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 20,
  },
  fbBox: {
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  fbTitle: { fontSize: 24, fontWeight: '900', marginBottom: 4, letterSpacing: -0.5 },
  fbXp: { fontSize: 16, color: '#34d399', fontWeight: '800', marginBottom: 2 },
  speedBonusText: { fontSize: 11, color: '#fbbf24', fontWeight: '700', marginBottom: 6 },
  fbAns: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, textAlign: 'center' },

  explanationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    width: '100%',
    marginTop: 6,
  },
  explanationTitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
});

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, ELEMENTS } from '../data/elements';
import { COLORS, RADIUS, SHADOWS } from '../theme';
import { triggerHaptic, playSound } from '../services/feedback';

const { width: W } = Dimensions.get('window');

interface SpeedBlitzProps {
  onFinish: (score: number, xpGained: number) => void;
  onClose: () => void;
}

export default function SpeedBlitzScreen({ onFinish, onClose }: SpeedBlitzProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentZ, setCurrentZ] = useState(1);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<any>(null);

  const generateQuestion = useCallback(() => {
    const targetZ = Math.floor(Math.random() * 54) + 1; // Focus on first 54 elements for blitz
    setCurrentZ(targetZ);

    const wrong: number[] = [];
    while (wrong.length < 3) {
      const r = Math.floor(Math.random() * 54) + 1;
      if (r !== targetZ && !wrong.includes(r)) wrong.push(r);
    }
    setOptions([targetZ, ...wrong].sort(() => Math.random() - 0.5));
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateQuestion();
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
  }, [generateQuestion]);

  useEffect(() => {
    if (timeLeft === 0) {
      const earnedXP = score * 10 + combo * 5;
      onFinish(score, earnedXP);
    }
  }, [timeLeft, score, combo, onFinish]);

  const handleGuess = (guessZ: number) => {
    if (feedback !== null || timeLeft === 0) return;

    if (guessZ === currentZ) {
      triggerHaptic('success');
      playSound('success');
      setScore(s => s + 1);
      setCombo(c => c + 1);
      setFeedback('correct');
      setTimeout(generateQuestion, 400);
    } else {
      triggerHaptic('error');
      playSound('error');
      setCombo(0);
      setFeedback('wrong');
      setTimeout(generateQuestion, 600);
    }
  };

  const targetEl = getElement(currentZ);

  return (
    <View style={B.container}>
      <LinearGradient colors={['rgba(244, 114, 182, 0.15)', 'rgba(10, 14, 26, 0.95)']} style={StyleSheet.absoluteFill} />

      {/* Top Header */}
      <View style={B.header}>
        <View style={B.timerBadge}>
          <Text style={[B.timerText, timeLeft <= 10 && { color: '#f87171' }]}>⏱️ {timeLeft}s</Text>
        </View>
        <View style={B.comboBadge}>
          <Text style={B.comboText}>🔥 Combo x{Math.max(1, Math.floor(combo / 3) + 1)}</Text>
        </View>
        <TouchableOpacity style={B.closeBtn} onPress={onClose}>
          <Text style={B.closeTxt}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Score HUD */}
      <View style={B.hud}>
        <Text style={B.scoreVal}>{score}</Text>
        <Text style={B.scoreLabel}>ELEMENTS IDENTIFIED</Text>
      </View>

      {/* Target Clue Card */}
      <View style={[B.clueCard, feedback === 'correct' && B.clueCorrect, feedback === 'wrong' && B.clueWrong]}>
        <Text style={B.clueZ}>Atomic Number Z = {currentZ}</Text>
        <Text style={B.clueSym}>{targetEl.sym}</Text>
        <Text style={B.clueMeta}>{targetEl.category.toUpperCase()} &bull; Mass: {targetEl.mass.toFixed(2)} u</Text>
      </View>

      {/* 4 Fast Options */}
      <View style={B.optionsGrid}>
        {options.map((optZ) => {
          const optEl = getElement(optZ);
          return (
            <TouchableOpacity
              key={optZ}
              style={B.optBtn}
              onPress={() => handleGuess(optZ)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFill} />
              <Text style={B.optName}>{optEl.nameEn}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const B = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fbbf24',
  },
  comboBadge: {
    backgroundColor: 'rgba(244, 114, 182, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(244, 114, 182, 0.3)',
  },
  comboText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f472b6',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  hud: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreVal: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -1,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 1.2,
  },
  clueCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  clueCorrect: {
    borderColor: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
  },
  clueWrong: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  clueZ: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 0.8,
  },
  clueSym: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.text,
    marginVertical: 8,
  },
  clueMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optBtn: {
    width: (W - 52) / 2,
    paddingVertical: 18,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  optName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
});

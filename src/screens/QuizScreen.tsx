import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getElement } from '../data/elements';
import { COLORS, RADIUS, getCategoryColor, SHADOWS } from '../theme';
import Atom3D from '../components/Atom3D';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function QuizScreen({
  z, elementLevels, discovered, pool,
  onCorrect, onNext,
}: {
  z: number; elementLevels: Record<number, number>; discovered: number[];
  pool: number[]; onCorrect: (z: number) => void; onNext: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const locked = useRef(false);

  const el = getElement(z);
  const cat = getCategoryColor(el.category);
  const options = React.useMemo(() => {
    const dists = getDistractors(z, pool);
    return [z, ...dists].sort(() => Math.random() - 0.5);
  }, [z, pool]);

  const handleGuess = useCallback((guess: number) => {
    if (locked.current) return;
    locked.current = true;
    setSelected(guess);
    if (guess === z) {
      setState('correct');
      setTimeout(() => { onCorrect(z); locked.current = false; setSelected(null); setState('playing'); }, 1400);
    } else {
      setState('wrong');
      setTimeout(() => { locked.current = false; setSelected(null); setState('playing'); onNext(); }, 2200);
    }
  }, [z, onCorrect, onNext]);

  const level = elementLevels[z] || 0;
  const xpGain = state === 'correct' ? xpForLevel(level) : 0;
  const atomSize = H * 0.32;

  return (
    <View style={Q.wrap}>
      {/* Top Glassmorphic Information Bar */}
      <View style={Q.propsOverlay}>
        <LinearGradient colors={['rgba(10, 14, 26, 0.75)', 'rgba(10, 14, 26, 0.95)']} style={StyleSheet.absoluteFill} />
        <View style={Q.propRow}>
          <View style={Q.prop}><Text style={[Q.propVal, { color: '#ef4444' }]}>{z}</Text><Text style={Q.propLbl}>Protons</Text></View>
          <View style={Q.prop}><Text style={[Q.propVal, { color: '#60a5fa' }]}>{Math.round(z * 1.2)}</Text><Text style={Q.propLbl}>Neutrons</Text></View>
          <View style={Q.prop}><Text style={[Q.propVal, { color: '#34d399' }]}>{z}</Text><Text style={Q.propLbl}>Electrons</Text></View>
          <View style={Q.prop}><Text style={[Q.propVal, { color: '#fbbf24' }]}>{el.mass?.toFixed(2) || '?'}</Text><Text style={Q.propLbl}>Mass (u)</Text></View>
        </View>
      </View>

      {/* 3D Atom Model */}
      <View style={Q.atomFull}>
        <Atom3D protons={z} neutrons={Math.round(z * 1.2)} electrons={z} size={atomSize} elementColor={el.color} />
      </View>

      {/* Answer Choices Grid */}
      <View style={Q.answerGrid}>
        {options.map(opt => {
          const optEl = getElement(opt);
          const optCat = getCategoryColor(optEl.category);
          const isCorrect = opt === z;
          const isSelected = selected === opt;

          let bg = COLORS.bgCard;
          let bc = COLORS.border;
          let tc = optCat;

          if (state === 'correct' && isCorrect) { bg = 'rgba(52, 211, 153, 0.12)'; bc = 'rgba(52, 211, 153, 0.4)'; tc = '#34d399'; }
          else if (state === 'wrong' && isSelected && !isCorrect) { bg = 'rgba(239, 68, 68, 0.12)'; bc = 'rgba(239, 68, 68, 0.4)'; tc = '#ef4444'; }
          else if (state === 'wrong' && isCorrect) { bg = 'rgba(52, 211, 153, 0.12)'; bc = 'rgba(52, 211, 153, 0.4)'; tc = '#34d399'; }

          return (
            <TouchableOpacity key={opt}
              style={[Q.optBtn, { backgroundColor: bg, borderColor: bc }]}
              onPress={() => handleGuess(opt)} activeOpacity={0.7} disabled={state !== 'playing'}>
              <Text style={[Q.optSym, { color: tc }]}>{optEl.sym}</Text>
              <Text style={Q.optName}>{optEl.nameEn}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Glassmorphic Feedback Overlay */}
      {state !== 'playing' && (
        <View style={Q.fbOverlay}>
          <View style={Q.fbBox}>
            <LinearGradient colors={['rgba(10, 14, 26, 0.95)', 'rgba(10, 14, 26, 0.98)']} style={StyleSheet.absoluteFill} />
            {state === 'correct' ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={[Q.fbTitle, { color: '#34d399' }]}>Correct!</Text>
                <Text style={Q.fbXp}>+{xpGain} XP</Text>
                {level === 0 && <Text style={Q.fbNew}>New discovery!</Text>}
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={[Q.fbTitle, { color: '#ef4444' }]}>Incorrect</Text>
                <Text style={Q.fbAns}>
                  Answer: <Text style={{ color: cat, fontWeight: '800' }}>{el.sym} ({el.nameEn})</Text>
                </Text>
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
  atomFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  propsOverlay: {
    borderRadius: RADIUS.md, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
    zIndex: 10,
  },
  propRow: { flexDirection: 'row', justifyContent: 'space-around' },
  prop: { alignItems: 'center' },
  propVal: { fontSize: 18, fontWeight: '800' },
  propLbl: { fontSize: 9, color: COLORS.textSecondary, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.3 },

  answerGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center',
    zIndex: 10,
  },
  optBtn: {
    width: '48%', paddingVertical: 12, borderRadius: RADIUS.md,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.card,
  },
  optSym: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  optName: { fontSize: 9, color: COLORS.textSecondary, textAlign: 'center' },

  fbOverlay: {
    ...StyleSheet.absoluteFillObject as object,
    backgroundColor: 'rgba(10, 14, 26, 0.7)',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 20,
  },
  fbBox: {
    borderRadius: RADIUS.lg, padding: 28, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    width: '80%', overflow: 'hidden',
    ...SHADOWS.glow,
  },
  fbTitle: { fontSize: 26, fontWeight: '900', marginBottom: 6, letterSpacing: -0.5 },
  fbXp: { fontSize: 18, color: '#fbbf24', fontWeight: '800' },
  fbNew: { fontSize: 12, color: COLORS.accent, marginTop: 6, fontWeight: '700', letterSpacing: 0.3 },
  fbAns: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
});

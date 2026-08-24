import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, ELEMENTS } from '../data/elements';
import { COLORS, RADIUS, SHADOWS, getCategoryColor } from '../theme';
import { triggerHaptic, playSound } from '../services/feedback';

const { width: W, height: H } = Dimensions.get('window');

interface FlashcardScreenProps {
  onClose: () => void;
  onMasterElement?: (z: number) => void;
}

export default function FlashcardScreen({ onClose, onMasterElement }: FlashcardScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredZList, setMasteredZList] = useState<number[]>([]);

  const activeElements = ELEMENTS.slice(0, 36); // Top 36 elements for active flashcard deck
  const currentEl = activeElements[currentIdx % activeElements.length];
  const catColor = getCategoryColor(currentEl.category);

  const flipCard = useCallback(() => {
    triggerHaptic('light');
    playSound('click');
    setIsFlipped(f => !f);
  }, []);

  const handleNext = useCallback((known: boolean) => {
    if (known) {
      triggerHaptic('success');
      playSound('success');
      setMasteredZList(prev => [...prev, currentEl.z]);
      if (onMasterElement) onMasterElement(currentEl.z);
    } else {
      triggerHaptic('error');
      playSound('error');
    }
    setIsFlipped(false);
    setCurrentIdx(i => (i + 1) % activeElements.length);
  }, [currentEl.z, activeElements.length, onMasterElement]);

  return (
    <View style={FC.wrap}>
      <LinearGradient colors={['rgba(10,14,26,0.95)', 'rgba(10,14,26,1.0)']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={FC.header}>
        <View>
          <Text style={FC.title}>SPACED FLASHCARDS</Text>
          <Text style={FC.sub}>Card {currentIdx + 1} of {activeElements.length} &bull; {masteredZList.length} Memorized</Text>
        </View>
        <TouchableOpacity style={FC.closeBtn} onPress={onClose}>
          <Text style={FC.closeTxt}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Flip Card */}
      <TouchableOpacity style={FC.cardContainer} onPress={flipCard} activeOpacity={0.9}>
        <LinearGradient
          colors={isFlipped ? ['rgba(99, 102, 241, 0.12)', 'rgba(10, 14, 26, 0.95)'] : ['rgba(255, 255, 255, 0.04)', 'rgba(10, 14, 26, 0.9)']}
          style={StyleSheet.absoluteFill}
        />

        {!isFlipped ? (
          /* Front Side: Chemical Symbol & Atomic Number */
          <View style={FC.cardFront}>
            <Text style={FC.frontZ}>Atomic Number Z = {currentEl.z}</Text>
            <View style={[FC.symBox, { borderColor: catColor, backgroundColor: catColor + '15' }]}>
              <Text style={[FC.symText, { color: catColor }]}>{currentEl.sym}</Text>
            </View>
            <Text style={FC.tapHint}>Tap anywhere to flip card ↺</Text>
          </View>
        ) : (
          /* Back Side: Name, Category, Discovery Lore, and Electron Config */
          <View style={FC.cardBack}>
            <Text style={[FC.backName, { color: catColor }]}>{currentEl.nameEn}</Text>
            <Text style={FC.backCategory}>{currentEl.category.toUpperCase()}</Text>
            <View style={FC.metaDivider} />
            <Text style={FC.backLore}>{currentEl.desc}</Text>
            <View style={FC.propPill}>
              <Text style={FC.propPillTxt}>Electron Config: {currentEl.electronConfig}</Text>
            </View>
            <Text style={FC.backDiscovered}>Discovered: {currentEl.discovered} ({currentEl.discoveredBy || 'Historical'})</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Review / Memorized Buttons */}
      <View style={FC.actionsRow}>
        <TouchableOpacity style={[FC.actionBtn, FC.btnReview]} onPress={() => handleNext(false)} activeOpacity={0.8}>
          <Text style={FC.btnReviewTxt}>Need Review ↻</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[FC.actionBtn, FC.btnMaster]} onPress={() => handleNext(true)} activeOpacity={0.8}>
          <Text style={FC.btnMasterTxt}>Memorized ✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const FC = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  sub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
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
    fontWeight: '700',
  },
  cardContainer: {
    height: H * 0.52,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  cardFront: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 16,
  },
  frontZ: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 1,
  },
  symBox: {
    width: 110,
    height: 110,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  symText: {
    fontSize: 54,
    fontWeight: '900',
  },
  tapHint: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 10,
  },
  cardBack: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  backName: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 4,
  },
  backCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  metaDivider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 14,
  },
  backLore: {
    fontSize: 12.5,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  propPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 10,
  },
  propPillTxt: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#34d399',
  },
  backDiscovered: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnReview: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  btnReviewTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f87171',
  },
  btnMaster: {
    backgroundColor: 'rgba(52, 211, 153, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.45)',
  },
  btnMasterTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#34d399',
  },
});

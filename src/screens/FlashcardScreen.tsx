import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, ELEMENTS } from '../data/elements';
import { COLORS, RADIUS, SHADOWS, getCategoryColor } from '../theme';
import { triggerHaptic, playSound } from '../services/feedback';
import { loadMasteredFlashcards, saveMasteredFlashcards } from '../data/storage';
import { shuffled } from '../utils/random';
import { recordReview } from '../data/flashcards';

const { width: W, height: H } = Dimensions.get('window');
const DECK_FILTERS = ['All', 'Nonmetal', 'Noble gas', 'Metal'] as const;

interface FlashcardScreenProps {
  onClose: () => void;
}

export default function FlashcardScreen({ onClose }: FlashcardScreenProps) {
  const reviewed = useRef(false);
  const [ready, setReady] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredZList, setMasteredZList] = useState<number[]>([]);
  const [deck, setDeck] = useState(() => ELEMENTS.slice(0, 36));
  const [deckFilter, setDeckFilter] = useState<(typeof DECK_FILTERS)[number]>('All');
  const [hideMastered, setHideMastered] = useState(false);

  useEffect(() => {
    let active = true;
    loadMasteredFlashcards().then(saved => { if (active) { setMasteredZList(saved); setReady(true); } });
    return () => { active = false; };
  }, []);

  const reviewDeck = hideMastered ? deck.filter(el => !masteredZList.includes(el.z)) : deck;
  const activeElements = reviewDeck.length ? reviewDeck : deck;
  const currentEl = activeElements[currentIdx % activeElements.length];
  const catColor = getCategoryColor(currentEl.category);

  const flipCard = useCallback(() => {
    reviewed.current = false;
    triggerHaptic('light');
    playSound('click');
    setIsFlipped(f => !f);
  }, []);

  const handleNext = useCallback((known: boolean) => {
    if (!ready || !isFlipped || reviewed.current) return;
    reviewed.current = true;
    const nextMastered = recordReview(masteredZList, currentEl.z, known);
    setMasteredZList(nextMastered);
    void saveMasteredFlashcards(nextMastered);
    if (known) {
      triggerHaptic('success');
      playSound('success');
    } else {
      triggerHaptic('error');
      playSound('error');
    }
    setIsFlipped(false);
    setCurrentIdx(i => (i + 1) % activeElements.length);
  }, [currentEl.z, activeElements.length, ready, isFlipped, masteredZList]);

  return (
    <View style={FC.wrap}>
      <LinearGradient colors={['rgba(10,14,26,0.95)', 'rgba(10,14,26,1.0)']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={FC.header}>
        <View>
          <Text style={FC.title}>PRACTICE FLASHCARDS</Text>
          <Text style={FC.sub}>Card {currentIdx + 1} of {activeElements.length} &bull; {masteredZList.length} Memorized</Text>
        </View>
        <View style={FC.headerActions}>
          <TouchableOpacity style={FC.closeBtn} onPress={() => { setMasteredZList([]); saveMasteredFlashcards([]); }} accessibilityLabel="Reset flashcard mastery"><Text style={FC.closeTxt}>↺</Text></TouchableOpacity>
          <TouchableOpacity style={FC.closeBtn} onPress={() => {
            setDeck(prev => shuffled(prev));
            setCurrentIdx(0);
            setIsFlipped(false);
          }} accessibilityLabel="Shuffle flashcards"><Text style={FC.closeTxt}>⤨</Text></TouchableOpacity>
          <TouchableOpacity style={FC.closeBtn} onPress={onClose}><Text style={FC.closeTxt}>✕</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={FC.filters} contentContainerStyle={FC.filtersContent}>
        {DECK_FILTERS.map(filter => (
          <TouchableOpacity key={filter} style={[FC.filterChip, deckFilter === filter && FC.filterChipActive]} onPress={() => {
            const base = ELEMENTS.slice(0, 36);
            const metalFamilies = ['Alkali metal', 'Alkaline earth', 'Transition metal', 'Post-transition'];
            const next = filter === 'All' ? base : filter === 'Metal' ? base.filter(el => metalFamilies.includes(el.category)) : base.filter(el => el.category === filter);
            setDeckFilter(filter);
            setDeck(next);
            setCurrentIdx(0);
            setIsFlipped(false);
          }}><Text style={[FC.filterText, deckFilter === filter && FC.filterTextActive]}>{filter}</Text></TouchableOpacity>
        ))}
      </ScrollView>
      <View style={FC.progressTrack} accessibilityLabel={`${masteredZList.length} mastered flashcards`}>
        <LinearGradient colors={['#34d399', '#22d3ee']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[FC.progressFill, { width: `${Math.min(100, (masteredZList.length / 36) * 100)}%` }]} />
      </View>
      <TouchableOpacity style={[FC.reviewToggle, hideMastered && FC.reviewToggleActive]} onPress={() => { setHideMastered(value => !value); setCurrentIdx(0); }}><Text style={FC.reviewToggleText}>{hideMastered ? 'Reviewing unmastered only' : 'Include mastered cards'}</Text></TouchableOpacity>

      {/* Interactive Flip Card */}
      <TouchableOpacity style={FC.cardContainer} onPress={flipCard} activeOpacity={0.9}>
        <LinearGradient
          colors={isFlipped ? ['rgba(99, 102, 241, 0.12)', 'rgba(10, 14, 26, 0.95)'] : ['rgba(255, 255, 255, 0.04)', 'rgba(10, 14, 26, 0.9)']}
          style={StyleSheet.absoluteFill}
        />
        {masteredZList.includes(currentEl.z) && <View style={FC.masteredBadge}><Text style={FC.masteredBadgeText}>✓ MASTERED</Text></View>}

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
        <TouchableOpacity style={FC.previousBtn} onPress={() => { setIsFlipped(false); setCurrentIdx(i => (i - 1 + activeElements.length) % activeElements.length); }} accessibilityLabel="Previous flashcard"><Text style={FC.previousTxt}>←</Text></TouchableOpacity>
        <TouchableOpacity disabled={!ready || !isFlipped} style={[FC.actionBtn, FC.btnReview, (!ready || !isFlipped) && { opacity: 0.4 }]} onPress={() => handleNext(false)} activeOpacity={0.8}>
          <Text style={FC.btnReviewTxt}>Need Review ↻</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={!ready || !isFlipped} style={[FC.actionBtn, FC.btnMaster, (!ready || !isFlipped) && { opacity: 0.4 }]} onPress={() => handleNext(true)} activeOpacity={0.8}>
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
  headerActions: { flexDirection: 'row', gap: 8 },
  filters: { flexGrow: 0, marginVertical: 10 },
  filtersContent: { gap: 8 },
  filterChip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: 'rgba(99,102,241,0.18)', borderColor: COLORS.primaryLight },
  filterText: { color: COLORS.textTertiary, fontSize: 10, fontWeight: '700' },
  filterTextActive: { color: COLORS.primaryLight },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  reviewToggle: { alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  reviewToggleActive: { borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.10)' }, reviewToggleText: { color: '#34d399', fontSize: 9, fontWeight: '800' },
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
  masteredBadge: { position: 'absolute', top: 14, right: 14, paddingHorizontal: 9, paddingVertical: 5, borderRadius: RADIUS.full, backgroundColor: 'rgba(52,211,153,0.14)', borderWidth: 1, borderColor: 'rgba(52,211,153,0.35)' },
  masteredBadgeText: { color: '#34d399', fontSize: 9, fontWeight: '900' },
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
  previousBtn: { width: 48, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  previousTxt: { color: COLORS.textSecondary, fontSize: 20, fontWeight: '800' },
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

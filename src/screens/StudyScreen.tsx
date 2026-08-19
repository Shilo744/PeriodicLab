import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, getCachedNeutrons, getShellConfig } from '../data/elements';
import { COLORS, RADIUS, getCategoryColor, SHADOWS } from '../theme';
import { isElementUnlocked } from '../data/storage';
import Atom3D from '../components/Atom3D';

const { height: H } = Dimensions.get('window');

interface StudyScreenProps {
  z: number;
  onChange: (z: number) => void;
  xp: number;
  levels: Record<number, number>;
  discovered: number[];
  onGoBuilder?: (z: number) => void;
}

type StudyTab = 'overview' | 'shells' | 'isotopes';

interface IsotopeInfo {
  massNumber: number;
  neutrons: number;
  abundance?: string;
  halfLife?: string;
  stable: boolean;
}

// Common isotopes for representative elements
function getIsotopesForElement(z: number, stableN: number, standardMass: number): IsotopeInfo[] {
  if (z === 1) {
    return [
      { massNumber: 1, neutrons: 0, abundance: '99.98%', stable: true },
      { massNumber: 2, neutrons: 1, abundance: '0.015%', stable: true }, // Deuterium
      { massNumber: 3, neutrons: 2, abundance: 'Trace', halfLife: '12.32 years (β⁻)', stable: false }, // Tritium
    ];
  }
  if (z === 6) {
    return [
      { massNumber: 12, neutrons: 6, abundance: '98.93%', stable: true },
      { massNumber: 13, neutrons: 7, abundance: '1.07%', stable: true },
      { massNumber: 14, neutrons: 8, abundance: 'Trace', halfLife: '5730 years (β⁻)', stable: false },
    ];
  }
  if (z === 92) {
    return [
      { massNumber: 234, neutrons: 142, abundance: '0.005%', halfLife: '245,500 y (α)', stable: false },
      { massNumber: 235, neutrons: 143, abundance: '0.72% (Fissile)', halfLife: '703.8 M y (α)', stable: false },
      { massNumber: 238, neutrons: 146, abundance: '99.27%', halfLife: '4.468 B y (α)', stable: false },
    ];
  }
  // Generic dynamic isotopes for any other element
  return [
    { massNumber: z + Math.max(0, stableN - 1), neutrons: Math.max(0, stableN - 1), abundance: 'Minor', stable: stableN > 1 },
    { massNumber: z + stableN, neutrons: stableN, abundance: 'Primary / Dominant', stable: z <= 83 },
    { massNumber: z + stableN + 1, neutrons: stableN + 1, abundance: 'Trace', halfLife: z > 83 ? 'Unstable' : undefined, stable: z <= 83 },
  ];
}

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export default function StudyScreen({ z, onChange, xp, levels, discovered, onGoBuilder }: StudyScreenProps) {
  const [p, setP] = useState(z);
  const [selectedTab, setSelectedTab] = useState<StudyTab>('overview');
  const [selectedIsotopeIdx, setSelectedIsotopeIdx] = useState(0);
  const [highlightedShell, setHighlightedShell] = useState<number | null>(null);

  useEffect(() => {
    setP(z);
    setSelectedIsotopeIdx(0);
    setHighlightedShell(null);
  }, [z]);

  const defaultStableN = getCachedNeutrons(p);
  const el = getElement(p);
  const isDiscovered = discovered.includes(p);
  const cat = getCategoryColor(el.category);
  const shells = getShellConfig(p);
  const isotopes = getIsotopesForElement(p, defaultStableN, el.mass);

  // Dynamic neutrons based on selected isotope
  const currentIsotope = isotopes[selectedIsotopeIdx] || isotopes[0];
  const activeNeutrons = selectedTab === 'isotopes' ? currentIsotope.neutrons : defaultStableN;

  useEffect(() => {
    onChange(p);
  }, [p, onChange]);

  const adjust = useCallback((d: number) => {
    setP(x => Math.max(1, Math.min(118, x + d)));
  }, []);

  const atomSize = H * 0.29;

  return (
    <View style={S.wrap}>
      {/* Top Header Card */}
      <View style={S.topCard}>
        <LinearGradient colors={['rgba(10, 14, 26, 0.85)', 'rgba(10, 14, 26, 0.95)']} style={StyleSheet.absoluteFill} />
        <View style={[S.symBox, { backgroundColor: cat + '18', borderColor: cat + '60' }]}>
          <Text style={[S.symText, { color: cat }]}>{el.sym}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={S.elName}>{el.nameEn}</Text>
          <Text style={S.elMeta}>
            {`${el.category.toUpperCase()} \u22C5 Z = ${p}`}
          </Text>
        </View>
        <View style={isDiscovered ? S.discoveredBadge : S.undiscoveredBadge}>
          <Text style={isDiscovered ? S.discoveredBadgeTxt : S.undiscoveredBadgeTxt}>
            {isDiscovered ? 'DISCOVERED' : 'UNDISCOVERED'}
          </Text>
        </View>
      </View>

      {/* Interactive Tabs (Overview | Quantum Shells | Isotopes) */}
      <View style={S.tabBar}>
        <TouchableOpacity
          style={[S.tabBtn, selectedTab === 'overview' && S.tabBtnActive]}
          onPress={() => setSelectedTab('overview')}
          activeOpacity={0.8}
        >
          <Text style={[S.tabBtnTxt, selectedTab === 'overview' && S.tabBtnTxtActive]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[S.tabBtn, selectedTab === 'shells' && S.tabBtnActive]}
          onPress={() => setSelectedTab('shells')}
          activeOpacity={0.8}
        >
          <Text style={[S.tabBtnTxt, selectedTab === 'shells' && S.tabBtnTxtActive]}>Quantum Shells</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[S.tabBtn, selectedTab === 'isotopes' && S.tabBtnActive]}
          onPress={() => setSelectedTab('isotopes')}
          activeOpacity={0.8}
        >
          <Text style={[S.tabBtnTxt, selectedTab === 'isotopes' && S.tabBtnTxtActive]}>Isotopes</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Model Stage */}
      <View style={S.atomFull}>
        <Atom3D
          protons={p}
          neutrons={activeNeutrons}
          electrons={p}
          size={atomSize}
          elementColor={el.color}
        />
      </View>

      {/* Bottom Panel */}
      <View style={S.bottomCard}>
        <LinearGradient colors={['rgba(10, 14, 26, 0.92)', 'rgba(10, 14, 26, 0.98)']} style={StyleSheet.absoluteFill} />

        {/* Navigation Slider */}
        <View style={S.sliderRow}>
          <TouchableOpacity style={S.sliderBtn} onPress={() => adjust(-1)} activeOpacity={0.65}>
            <Text style={S.sliderTxt}>{'\u2212'}</Text>
          </TouchableOpacity>
          <View style={S.track}>
            <LinearGradient colors={[cat, cat + '40']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[S.trackFill, { width: `${(p / 118) * 100}%` }]} />
          </View>
          <TouchableOpacity style={S.sliderBtn} onPress={() => adjust(1)} activeOpacity={0.65}>
            <Text style={S.sliderTxt}>+</Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'overview' && (
          <>
            {/* Stats Bar */}
            <View style={S.statsBar}>
              <View style={S.stat}>
                <Text style={[S.statVal, { color: '#ef4444' }]}>{p}</Text>
                <Text style={S.statLbl}>Protons</Text>
              </View>
              <View style={S.stat}>
                <Text style={[S.statVal, { color: '#60a5fa' }]}>{defaultStableN}</Text>
                <Text style={S.statLbl}>Neutrons</Text>
              </View>
              <View style={S.stat}>
                <Text style={[S.statVal, { color: '#34d399' }]}>{p}</Text>
                <Text style={S.statLbl}>Electrons</Text>
              </View>
              <View style={S.stat}>
                <Text style={[S.statVal, { color: '#fbbf24' }]}>{el.mass.toFixed(2)}</Text>
                <Text style={S.statLbl}>Mass (u)</Text>
              </View>
            </View>

            {/* Properties Grid */}
            <View style={S.propsGrid}>
              <View style={S.propItem}>
                <Text style={S.propLbl}>Configuration</Text>
                <Text style={S.propVal}>{el.electronConfig || 'N/A'}</Text>
              </View>
              <View style={S.propItem}>
                <Text style={S.propLbl}>State at STP</Text>
                <Text style={S.propVal}>{el.state.toUpperCase()}</Text>
              </View>
              <View style={S.propItem}>
                <Text style={S.propLbl}>Melting / Boiling</Text>
                <Text style={S.propVal}>{el.meltingPoint !== undefined ? `${el.meltingPoint}°C` : 'N/A'}</Text>
              </View>
              <View style={S.propItem}>
                <Text style={S.propLbl}>Discovered</Text>
                <Text style={S.propVal} numberOfLines={1}>{el.discovered} ({el.discoveredBy || 'Antiquity'})</Text>
              </View>
            </View>
          </>
        )}

        {selectedTab === 'shells' && (
          <View style={S.shellsContainer}>
            <Text style={S.sectionHeading}>ELECTRON DISTRIBUTION BY ENERGY LEVEL (BOHR / AUFBAU)</Text>
            <View style={S.shellPillsRow}>
              {shells.map((count, idx) => {
                const isValence = idx === shells.length - 1;
                const isHigh = highlightedShell === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      S.shellPill,
                      isValence && S.shellPillValence,
                      isHigh && S.shellPillHighlighted
                    ]}
                    onPress={() => setHighlightedShell(isHigh ? null : idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={S.shellName}>{SHELL_NAMES[idx]} (n={idx + 1})</Text>
                    <Text style={S.shellCount}>{count} e⁻</Text>
                    {isValence && <Text style={S.valenceTag}>VALENCE</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={S.shellExplain}>
              Total Valence Electrons: <Text style={{ color: '#34d399', fontWeight: '800' }}>{shells[shells.length - 1]}</Text> in outer shell.
            </Text>
          </View>
        )}

        {selectedTab === 'isotopes' && (
          <View style={S.isotopesContainer}>
            <Text style={S.sectionHeading}>SELECT ISOTOPE VARIANT</Text>
            <View style={S.isotopesList}>
              {isotopes.map((iso, idx) => {
                const isSel = selectedIsotopeIdx === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[S.isoCard, isSel && S.isoCardActive]}
                    onPress={() => setSelectedIsotopeIdx(idx)}
                    activeOpacity={0.8}
                  >
                    <View style={S.isoTop}>
                      <Text style={[S.isoSymbol, isSel && { color: cat }]}>
                        ^{iso.massNumber}{el.sym}
                      </Text>
                      <View style={[S.isoStatusBadge, { backgroundColor: iso.stable ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)' }]}>
                        <Text style={[S.isoStatusText, { color: iso.stable ? '#34d399' : '#f87171' }]}>
                          {iso.stable ? 'Stable' : 'Radioactive'}
                        </Text>
                      </View>
                    </View>
                    <Text style={S.isoDetails}>
                      Neutrons: {iso.neutrons} &bull; {iso.abundance || iso.halfLife}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Action Button for undiscovered elements */}
        {!isDiscovered && onGoBuilder && (
          <TouchableOpacity 
            style={[S.actionBtn, { backgroundColor: cat + 'D9', marginTop: 8 }]}
            onPress={() => onGoBuilder(p)}
            activeOpacity={0.8}
          >
            <Text style={S.actionBtnTxt}>Synthesize in Builder (+50 XP)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: { 
    flex: 1, 
    backgroundColor: COLORS.bg,
    paddingTop: 50,
    paddingBottom: 110,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  atomFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: RADIUS.md, padding: 10,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
    zIndex: 10,
  },
  symBox: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginRight: 10 },
  symText: { fontSize: 18, fontWeight: '800' },
  elName: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  elMeta: { fontSize: 10.5, color: COLORS.textSecondary, marginTop: 2, letterSpacing: 0.5 },

  undiscoveredBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  undiscoveredBadgeTxt: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 0.5,
  },
  discoveredBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discoveredBadgeTxt: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#34d399',
    letterSpacing: 0.5,
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    padding: 3,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: RADIUS.sm - 2,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  tabBtnTxt: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  tabBtnTxtActive: {
    color: COLORS.primaryLight,
  },

  bottomCard: {
    borderRadius: RADIUS.xl, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
    zIndex: 10,
  },

  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  sliderBtn: {
    width: 32, height: 32, borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  sliderTxt: { fontSize: 18, fontWeight: '600', color: COLORS.textSecondary },
  track: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 2 },

  statsBar: {
    flexDirection: 'row', justifyContent: 'space-around',
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: COLORS.borderLight, paddingVertical: 8,
    marginBottom: 8,
  },
  stat: { alignItems: 'center' },
  statVal: { fontSize: 15, fontWeight: '800' },
  statLbl: { fontSize: 8, color: COLORS.textSecondary, marginTop: 1, textTransform: 'uppercase', letterSpacing: 0.5 },

  propsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 5,
    marginBottom: 2,
  },
  propItem: {
    width: '49%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: RADIUS.sm,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  propLbl: {
    fontSize: 7.5,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  propVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  // Shells View
  shellsContainer: {
    paddingVertical: 4,
  },
  sectionHeading: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  shellPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 8,
  },
  shellPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    minWidth: 45,
  },
  shellPillValence: {
    borderColor: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  shellPillHighlighted: {
    borderColor: '#fbbf24',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
  },
  shellName: {
    fontSize: 7.5,
    fontWeight: '800',
    color: COLORS.textTertiary,
  },
  shellCount: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },
  valenceTag: {
    fontSize: 6.5,
    fontWeight: '900',
    color: '#34d399',
    marginTop: 1,
  },
  shellExplain: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Isotopes View
  isotopesContainer: {
    paddingVertical: 4,
  },
  isotopesList: {
    gap: 5,
    marginBottom: 6,
  },
  isoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.sm,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  isoCardActive: {
    borderColor: 'rgba(99, 102, 241, 0.4)',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  isoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  isoSymbol: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  isoStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  isoStatusText: {
    fontSize: 8,
    fontWeight: '800',
  },
  isoDetails: {
    fontSize: 9.5,
    color: COLORS.textTertiary,
    marginTop: 2,
  },

  actionBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  actionBtnTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
});

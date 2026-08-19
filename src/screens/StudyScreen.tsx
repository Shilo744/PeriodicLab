import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, getCachedNeutrons } from '../data/elements';
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

export default function StudyScreen({ z, onChange, xp, levels, discovered, onGoBuilder }: StudyScreenProps) {
  const [p, setP] = useState(z);
  
  useEffect(() => {
    setP(z);
  }, [z]);

  const n = getCachedNeutrons(p);
  const el = getElement(p);
  const isDiscovered = discovered.includes(p);
  const cat = getCategoryColor(el.category);

  useEffect(() => {
    onChange(p);
  }, [p, onChange]);

  const adjust = useCallback((d: number) => {
    setP(x => Math.max(1, Math.min(118, x + d)));
  }, []);

  const atomSize = H * 0.32;

  const activeColor = el.color;

  return (
    <View style={S.wrap}>
      {/* Top Glassmorphic Information Card */}
      <View style={S.topCard}>
        <LinearGradient colors={['rgba(10, 14, 26, 0.8)', 'rgba(10, 14, 26, 0.95)']} style={StyleSheet.absoluteFill} />
        <View style={[S.symBox, { backgroundColor: cat + '15', borderColor: cat + '50' }]}>
          <Text style={[S.symText, { color: cat }]}>
            {el.sym}
          </Text>
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

      {/* 3D Model Stage */}
      <View style={S.atomFull}>
        <Atom3D protons={p} neutrons={n} electrons={p} size={atomSize} elementColor={activeColor} />
      </View>

      {/* Bottom Integrated Telemetry Control Panel */}
      <View style={S.bottomCard}>
        <LinearGradient colors={['rgba(10, 14, 26, 0.9)', 'rgba(10, 14, 26, 0.98)']} style={StyleSheet.absoluteFill} />
        
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

        {/* Stats Bar */}
        <View style={S.statsBar}>
          <View style={S.stat}>
            <Text style={[S.statVal, { color: '#ef4444' }]}>{p}</Text>
            <Text style={S.statLbl}>Protons</Text>
          </View>
          <View style={S.stat}>
            <Text style={[S.statVal, { color: '#60a5fa' }]}>{n}</Text>
            <Text style={S.statLbl}>Neutrons</Text>
          </View>
          <View style={S.stat}>
            <Text style={[S.statVal, { color: '#34d399' }]}>{p}</Text>
            <Text style={S.statLbl}>Electrons</Text>
          </View>
          <View style={S.stat}>
            <Text style={[S.statVal, { color: '#fbbf24' }]}>{el.mass !== undefined ? el.mass.toFixed(2) : p + n}</Text>
            <Text style={S.statLbl}>Mass (u)</Text>
          </View>
        </View>

        {/* Description */}
        <View style={S.descRow}>
          <Text style={S.descTitle}>CHEMICAL PROPERTIES</Text>
          <Text style={S.desc}>{el.desc || 'No experimental details recorded for this heavy element.'}</Text>
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
            <Text style={S.propLbl}>Melting Point</Text>
            <Text style={S.propVal}>{el.meltingPoint !== undefined ? `${el.meltingPoint} °C` : 'N/A'}</Text>
          </View>
          <View style={S.propItem}>
            <Text style={S.propLbl}>Boiling Point</Text>
            <Text style={S.propVal}>{el.boilingPoint !== undefined ? `${el.boilingPoint} °C` : 'N/A'}</Text>
          </View>
        </View>

        {/* Action Button for undiscovered elements */}
        {!isDiscovered && onGoBuilder && (
          <TouchableOpacity 
            style={[S.actionBtn, { backgroundColor: cat + 'D9', marginTop: 12 }]}
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

  topCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: RADIUS.md, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
    zIndex: 10,
  },
  symBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginRight: 12 },
  symText: { fontSize: 20, fontWeight: '800' },
  elName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  elMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3, letterSpacing: 0.5 },

  undiscoveredBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  undiscoveredBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 0.5,
  },
  discoveredBadge: {
    backgroundColor: 'rgba(0, 255, 135, 0.12)',
    borderColor: 'rgba(0, 255, 135, 0.5)',
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discoveredBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00ff87',
    letterSpacing: 0.5,
  },

  bottomCard: {
    borderRadius: RADIUS.xl, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
    zIndex: 10,
  },

  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  sliderBtn: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  sliderTxt: { fontSize: 20, fontWeight: '600', color: COLORS.textSecondary },
  track: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2.5, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 2.5 },

  statsBar: {
    flexDirection: 'row', justifyContent: 'space-around',
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: COLORS.borderLight, paddingVertical: 10,
    marginBottom: 10,
  },
  stat: { alignItems: 'center' },
  statVal: { fontSize: 17, fontWeight: '800' },
  statLbl: { fontSize: 9, color: COLORS.textSecondary, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },

  descRow: { marginTop: 2, marginBottom: 8 },
  descTitle: { fontSize: 9, fontWeight: '800', color: COLORS.textTertiary, letterSpacing: 0.5, marginBottom: 4 },
  desc: { fontSize: 11.5, color: COLORS.textSecondary, lineHeight: 16 },

  propsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
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
    fontSize: 8,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  propVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  actionBtn: {
    width: '100%',
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  actionBtnTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
});

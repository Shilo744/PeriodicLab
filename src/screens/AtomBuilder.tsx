import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, getStableNeutrons } from '../data/elements';
import { COLORS, SHADOWS, RADIUS, getCategoryColor } from '../theme';
import { isElementUnlocked } from '../data/storage';
import Atom3D from '../components/Atom3D';

const H = Dimensions.get('window').height;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AtomBuilderProps {
  z: number;
  onDiscover: (n: number) => void;
  found: number[];
  xp: number;
  levels: Record<number, number>;
}

export default function AtomBuilder({ z, onDiscover, found, xp, levels }: AtomBuilderProps) {
  const [p, setP] = useState(z);
  const [n, setN] = useState(1);
  const [e, setE] = useState(1);
  const [showCongrats, setShowCongrats] = useState<number | null>(null);

  // Synchronize target z selection when changed from tab navigation
  useEffect(() => {
    setP(z);
    const stable = getStableNeutrons(z);
    setN(stable > 1 ? stable - 1 : 0); // Start slightly unbalanced
    setE(z > 1 ? z - 1 : 0);
  }, [z]);

  const isUnlocked = isElementUnlocked(p, xp, levels);
  const isFound = found.includes(p);
  const targetStableN = getStableNeutrons(p);

  const el = getElement(p);
  const cat = getCategoryColor(el.category);

  // Checks if user balances matches target element recipe
  const isBalanced = p > 0 && n === targetStableN && e === p;

  const changeProtons = useCallback((d: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const nextP = Math.max(1, Math.min(118, p + d));
    setP(nextP);
    const stableN = getStableNeutrons(nextP);
    setN(stableN > 1 ? stableN - 1 : 0);
    setE(nextP > 1 ? nextP - 1 : 0);
  }, [p]);

  const changeNeutrons = useCallback((d: number) => {
    setN(x => Math.max(0, Math.min(p * 2.5, x + d)));
  }, [p]);

  const changeElectrons = useCallback((d: number) => {
    setE(x => Math.max(0, Math.min(p * 2, x + d)));
  }, [p]);

  const handleSynthesize = useCallback(() => {
    if (isBalanced && !isFound) {
      onDiscover(p);
      setShowCongrats(p);
    }
  }, [isBalanced, isFound, p, onDiscover]);

  const atomSize = H * 0.32;
  const prevEl = p > 1 ? getElement(p - 1) : null;
  const prevLvl = p > 1 ? (levels[p - 1] || 0) : 0;
  const reqXP = (p - 3) * 120;

  // Real-time balancing feedback text
  let feedbackText = 'Balance particles to stabilize...';
  let isChargeOk = e === p;
  let isNucleusOk = n === targetStableN;

  if (p > 0) {
    if (e < p) {
      feedbackText = `⚠️ Positive Ion (Charge: +${p - e}). Add electrons!`;
    } else if (e > p) {
      feedbackText = `⚠️ Negative Ion (Charge: ${p - e}). Remove electrons!`;
    } else if (n < targetStableN) {
      feedbackText = `⚠️ Unstable Nucleus (Need ${targetStableN} Neutrons, current: ${n}). Add neutrons!`;
    } else if (n > targetStableN) {
      feedbackText = `⚠️ Unstable Nucleus (Need ${targetStableN} Neutrons, current: ${n}). Remove neutrons!`;
    } else {
      feedbackText = 'Atom configuration is stable and balanced!';
    }
  }

  // Active color for particle model
  const activeColor = isUnlocked ? el.color : '#475569';

  return (
    <View style={A.wrap}>
      {/* Top Info & Element Selector Card */}
      <View style={A.infoFloat}>
        <LinearGradient
          colors={[isUnlocked && isFound ? cat + '20' : 'rgba(10, 14, 26, 0.8)', 'rgba(10, 14, 26, 0.95)']}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={A.navBtn} onPress={() => changeProtons(-1)}>
          <Text style={A.navBtnTxt}>&lt;</Text>
        </TouchableOpacity>

        <View style={[A.symBox, { backgroundColor: isUnlocked ? cat + '15' : 'rgba(255,255,255,0.02)', borderColor: isUnlocked ? cat + '50' : 'rgba(255,255,255,0.08)' }]}>
          <Text style={[A.symText, { color: isUnlocked ? cat : '#475569' }]}>
            {isUnlocked ? el.sym : '?'}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={A.elName}>
            {isUnlocked ? el.nameEn : 'Locked Element'}
          </Text>
          <Text style={A.elMeta}>
            {isUnlocked ? `${el.category.toUpperCase()} \u22C5 Z = ${p}` : `Atomic Number = ${p}`}
          </Text>
        </View>

        <TouchableOpacity style={A.navBtn} onPress={() => changeProtons(1)}>
          <Text style={A.navBtnTxt}>&gt;</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Model Stage */}
      <View style={A.stage}>
        <Atom3D protons={p} neutrons={n} electrons={e} size={atomSize} elementColor={activeColor} />
      </View>

      {/* Control Panel (Locked vs Interactive) */}
      <View style={A.bottom}>
        <LinearGradient colors={['rgba(10,14,26,0.85)', 'rgba(10,14,26,0.98)']} style={StyleSheet.absoluteFill} />
        
        {!isUnlocked ? (
          /* Lock Overlay Panel */
          <View style={A.lockPanel}>
            <View style={A.lockHeaderRow}>
              <Text style={A.lockTitle}>ELEMENT LOCKED</Text>
            </View>
            <Text style={A.lockDesc}>
              Complete one of these milestones to unlock this element:
            </Text>
            <View style={A.reqCard}>
              <Text style={A.reqText}>• Master {prevEl?.nameEn} ({prevEl?.sym}) to Level 2 (Current: Lvl {prevLvl}/2)</Text>
              <Text style={A.reqText}>• Accumulate {reqXP} total XP (Current: {xp} XP)</Text>
            </View>
          </View>
        ) : (
          /* Interactive Particle Tuning */
          <>
            {/* Realtime Balancing Readout */}
            <Text style={[
              A.feedback, 
              { color: isBalanced ? COLORS.success : isChargeOk ? '#fbbf24' : '#ef4444' }
            ]}>
              {feedbackText}
            </Text>

            {/* Sliders for Neutrons and Electrons */}
            <View style={A.particleControl}>
              <View style={A.particleRow}>
                <View style={{ flex: 1 }}>
                  <View style={A.rowHeader}>
                    <Text style={[A.particleLabel, { color: '#60a5fa' }]}>NEUTRONS</Text>
                    <Text style={A.particleCount}>{n} <Text style={{ color: COLORS.textTertiary }}>/ {targetStableN}</Text></Text>
                  </View>
                  <View style={A.track}>
                    <View style={[A.trackFill, { backgroundColor: isNucleusOk ? '#60a5fa' : '#475569', width: `${Math.min(100, (n / Math.max(1, targetStableN)) * 100)}%` }]} />
                  </View>
                </View>
                <View style={A.rowControls}>
                  <TouchableOpacity style={A.adjustBtn} onPress={() => changeNeutrons(-1)}>
                    <Text style={A.adjustTxt}>{'\u2212'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={A.adjustBtn} onPress={() => changeNeutrons(1)}>
                    <Text style={A.adjustTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={A.particleRow}>
                <View style={{ flex: 1 }}>
                  <View style={A.rowHeader}>
                    <Text style={[A.particleLabel, { color: '#34d399' }]}>ELECTRONS</Text>
                    <Text style={A.particleCount}>{e} <Text style={{ color: COLORS.textTertiary }}>/ {p}</Text></Text>
                  </View>
                  <View style={A.track}>
                    <View style={[A.trackFill, { backgroundColor: isChargeOk ? '#34d399' : '#475569', width: `${Math.min(100, (e / p) * 100)}%` }]} />
                  </View>
                </View>
                <View style={A.rowControls}>
                  <TouchableOpacity style={A.adjustBtn} onPress={() => changeElectrons(-1)}>
                    <Text style={A.adjustTxt}>{'\u2212'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={A.adjustBtn} onPress={() => changeElectrons(1)}>
                    <Text style={A.adjustTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {isFound ? (
              <View style={A.foundBadge}>
                <LinearGradient colors={['rgba(0, 255, 135, 0.12)', 'rgba(0, 255, 135, 0.02)']} style={StyleSheet.absoluteFill} />
                <Text style={A.foundTxt}>Registered in Database</Text>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={handleSynthesize} 
                activeOpacity={0.85}
                disabled={!isBalanced}
              >
                <LinearGradient
                  colors={isBalanced ? ['#6366f1', '#a855f7'] : ['#2f3640', '#1f242d']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={A.discoverBtn}
                >
                  <Text style={[A.discoverTxt, { color: isBalanced ? '#FFFFFF' : COLORS.textTertiary }]}>
                    {isBalanced ? `Synthesize ${el.sym} (+50 XP)` : 'Balance Nucleus & Shell'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Full-Screen Congratulatory Discovery Modal */}
      {showCongrats !== null && (
        <Modal transparent animationType="fade" visible={showCongrats !== null}>
          <View style={A.modalOverlay}>
            <View style={A.modalBox}>
              <LinearGradient colors={['rgba(10,14,26,0.98)', 'rgba(10,14,26,1.0)']} style={StyleSheet.absoluteFill} />
              
              <Text style={A.congratsTitle}>ELEMENT DISCOVERED</Text>
              
              <View style={[A.congratsSymBox, { borderColor: cat, backgroundColor: cat + '10' }]}>
                <Text style={[A.congratsSym, { color: cat }]}>{getElement(showCongrats).sym}</Text>
              </View>

              <Text style={A.congratsName}>{getElement(showCongrats).nameEn}</Text>
              <Text style={A.congratsSub}>{getElement(showCongrats).category} &bull; Z = {showCongrats}</Text>

              <View style={A.rewardsCard}>
                <Text style={A.rewardText}>Synthesis Complete</Text>
                <Text style={A.rewardXP}>+50 XP Gained</Text>
                <Text style={A.rewardText}>Added to Study & Quiz pools.</Text>
              </View>

              <TouchableOpacity 
                style={[A.confirmBtn, { backgroundColor: cat }]}
                onPress={() => setShowCongrats(null)}
              >
                <Text style={A.confirmBtnTxt}>Accept & Inspect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const A = StyleSheet.create({
  wrap: { 
    flex: 1, 
    backgroundColor: COLORS.bg,
    paddingTop: 54,
    paddingBottom: 110,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  stage: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  atomView: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoFloat: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: RADIUS.md, padding: 10,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
    zIndex: 10,
  },
  navBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  navBtnTxt: { fontSize: 16, fontWeight: '700', color: COLORS.textSecondary },
  symBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginHorizontal: 10 },
  symText: { fontSize: 20, fontWeight: '800' },
  elName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  elMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, letterSpacing: 0.5 },

  bottom: {
    borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 16, overflow: 'hidden',
    ...SHADOWS.card,
    zIndex: 10,
  },

  // Lock panel
  lockPanel: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  lockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  lockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f87171',
    letterSpacing: 0.5,
  },
  lockDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  reqCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reqText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // Interactive controls
  feedback: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  particleControl: {
    marginBottom: 16,
    gap: 8,
  },
  particleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  particleLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  particleCount: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  track: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 2 },
  rowControls: {
    flexDirection: 'row',
    gap: 8,
  },
  adjustBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adjustTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  discoverBtn: { borderRadius: RADIUS.md, padding: 13, alignItems: 'center', ...SHADOWS.glow },
  discoverTxt: { fontSize: 13, fontWeight: '800' },

  foundBadge: {
    borderRadius: RADIUS.md, padding: 13, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0, 255, 135, 0.3)', overflow: 'hidden',
  },
  foundTxt: { fontSize: 13, fontWeight: '700', color: '#34d399' },

  // Congrats Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 26, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: RADIUS.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  congratsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  congratsSymBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  congratsSym: {
    fontSize: 32,
    fontWeight: '900',
  },
  congratsName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  congratsSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  rewardsCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  rewardXP: {
    fontSize: 16,
    fontWeight: '800',
    color: '#34d399',
  },
  confirmBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  confirmBtnTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
});

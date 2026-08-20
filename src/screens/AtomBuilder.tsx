import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, getStableNeutrons, ELEMENTS } from '../data/elements';
import { COMPOUNDS, Compound, findMatchingCompound } from '../data/compounds';
import { COLORS, SHADOWS, RADIUS, getCategoryColor } from '../theme';
import { isElementUnlocked } from '../data/storage';
import Atom3D from '../components/Atom3D';
import { triggerHaptic, playSound } from '../services/feedback';

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

type BuilderMode = 'tuning' | 'fusion' | 'compounds';

// Common building block elements for compound synthesis
const COMPOUND_ELEMENTS = [1, 6, 7, 8, 11, 12, 17, 26]; // H, C, N, O, Na, Mg, Cl, Fe

export default function AtomBuilder({ z, onDiscover, found, xp, levels }: AtomBuilderProps) {
  const [p, setP] = useState(z);
  const [n, setN] = useState(1);
  const [e, setE] = useState(1);
  const [mode, setMode] = useState<BuilderMode>('tuning');
  const [fusionA, setFusionA] = useState(1);
  const [fusionB, setFusionB] = useState(Math.max(1, z - 1));
  const [showCongrats, setShowCongrats] = useState<number | null>(null);
  
  // Compounds mode state
  const [compoundVessel, setCompoundVessel] = useState<Record<number, number>>({ 1: 2, 8: 1 }); // Default H2O
  const [synthesizedCompound, setSynthesizedCompound] = useState<Compound | null>(null);

  // Synchronize target z selection when changed from outside
  useEffect(() => {
    setP(z);
    const stable = getStableNeutrons(z);
    setN(stable > 1 ? stable - 1 : 0);
    setE(z > 1 ? z - 1 : 0);
    setFusionA(1);
    setFusionB(Math.max(1, z - 1));
  }, [z]);

  const isUnlocked = isElementUnlocked(p, xp, levels);
  const isFound = found.includes(p);
  const targetStableN = getStableNeutrons(p);

  const el = getElement(p);
  const cat = getCategoryColor(el.category);

  // Nuclear physics calculations
  const deltaN = n - targetStableN;
  const charge = p - e;
  const isNucleusOk = deltaN === 0;
  const isChargeOk = charge === 0;
  const isBalanced = p > 0 && isNucleusOk && isChargeOk;

  // Nuclear stability classification & decay modes
  let stabilityStatus = 'Stable Nucleus';
  let stabilityColor = COLORS.success;
  let decayType: 'none' | 'beta_minus' | 'beta_plus' | 'alpha' = 'none';

  if (p > 83) {
    decayType = 'alpha';
    stabilityStatus = 'Alpha (α) Decay Radioactivity';
    stabilityColor = '#f87171';
  } else if (deltaN > 0) {
    decayType = 'beta_minus';
    stabilityStatus = `Beta Minus (β⁻) Decay (+${deltaN} Excess N)`;
    stabilityColor = '#fbbf24';
  } else if (deltaN < 0) {
    decayType = 'beta_plus';
    stabilityStatus = `Beta Plus (β⁺) / Positron Emission (${deltaN} N)`;
    stabilityColor = '#f87171';
  }

  // Charge state text
  let chargeLabel = '0 (Neutral)';
  let chargeColor = COLORS.success;
  if (charge > 0) {
    chargeLabel = `+${charge} (Cation)`;
    chargeColor = '#60a5fa';
  } else if (charge < 0) {
    chargeLabel = `${charge} (Anion)`;
    chargeColor = '#f472b6';
  }

  const changeProtons = useCallback((d: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    triggerHaptic('light');
    playSound('click');
    const nextP = Math.max(1, Math.min(118, p + d));
    setP(nextP);
    const stableN = getStableNeutrons(nextP);
    setN(stableN > 1 ? stableN - 1 : 0);
    setE(nextP > 1 ? nextP - 1 : 0);
    setFusionA(1);
    setFusionB(Math.max(1, nextP - 1));
  }, [p]);

  const changeNeutrons = useCallback((d: number) => {
    triggerHaptic('light');
    playSound('click');
    setN(x => Math.max(0, Math.min(Math.round(p * 2.5), x + d)));
  }, [p]);

  const changeElectrons = useCallback((d: number) => {
    triggerHaptic('light');
    playSound('click');
    setE(x => Math.max(0, Math.min(Math.round(p * 2), x + d)));
  }, [p]);

  const handleSynthesize = useCallback(() => {
    if (isBalanced && !isFound) {
      triggerHaptic('success');
      playSound('synthesize');
      onDiscover(p);
      setShowCongrats(p);
    }
  }, [isBalanced, isFound, p, onDiscover]);

  // Fusion synthesis handler
  const isFusionValid = (fusionA + fusionB === p) && found.includes(fusionA) && found.includes(fusionB);
  const handleFusionSynthesize = useCallback(() => {
    if (isFusionValid && !isFound) {
      triggerHaptic('success');
      playSound('synthesize');
      onDiscover(p);
      setShowCongrats(p);
    }
  }, [isFusionValid, isFound, p, onDiscover]);

  // Compound Synthesis handler
  const matchedCompound = findMatchingCompound(compoundVessel);
  const updateVessel = (atomZ: number, delta: number) => {
    triggerHaptic('light');
    playSound('click');
    setCompoundVessel(prev => {
      const current = prev[atomZ] || 0;
      const nextVal = Math.max(0, current + delta);
      const updated = { ...prev, [atomZ]: nextVal };
      if (nextVal === 0) delete updated[atomZ];
      return updated;
    });
  };

  const handleCompoundSynthesize = () => {
    if (matchedCompound) {
      triggerHaptic('success');
      playSound('synthesize');
      setSynthesizedCompound(matchedCompound);
    }
  };

  const atomSize = H * 0.28;
  const prevEl = p > 1 ? getElement(p - 1) : null;
  const prevLvl = p > 1 ? (levels[p - 1] || 0) : 0;
  const reqXP = (p - 3) * 120;

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

      {/* Mode Switcher Tabs */}
      {isUnlocked && (
        <View style={A.modeTabContainer}>
          <TouchableOpacity 
            style={[A.modeTab, mode === 'tuning' && A.modeTabActive]} 
            onPress={() => setMode('tuning')}
            activeOpacity={0.8}
          >
            <Text style={[A.modeTabTxt, mode === 'tuning' && A.modeTabTxtActive]}>Particle Tuning</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[A.modeTab, mode === 'fusion' && A.modeTabActive]} 
            onPress={() => setMode('fusion')}
            activeOpacity={0.8}
          >
            <Text style={[A.modeTabTxt, mode === 'fusion' && A.modeTabTxtActive]}>Fusion 💥</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[A.modeTab, mode === 'compounds' && A.modeTabActive]} 
            onPress={() => setMode('compounds')}
            activeOpacity={0.8}
          >
            <Text style={[A.modeTabTxt, mode === 'compounds' && A.modeTabTxtActive]}>Molecules 🧪</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 3D Model Stage */}
      <View style={A.stage}>
        <Atom3D protons={p} neutrons={n} electrons={e} size={atomSize} elementColor={activeColor} />
      </View>

      {/* Control Panel (Locked vs Interactive) */}
      <View style={A.bottom}>
        <LinearGradient colors={['rgba(10,14,26,0.92)', 'rgba(10,14,26,0.98)']} style={StyleSheet.absoluteFill} />
        
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
        ) : mode === 'tuning' ? (
          /* Interactive Particle Tuning Mode */
          <>
            {/* Live Nuclear & Charge Telemetry Header */}
            <View style={A.telemetryRow}>
              <View style={A.telemetryBadge}>
                <Text style={A.telemetryLabel}>NUCLEAR STABILITY</Text>
                <Text style={[A.telemetryVal, { color: isNucleusOk ? COLORS.success : stabilityColor }]}>
                  {isNucleusOk ? '100% Stable (Target)' : stabilityStatus}
                </Text>
              </View>
              <View style={A.telemetryBadge}>
                <Text style={A.telemetryLabel}>NET CHARGE</Text>
                <Text style={[A.telemetryVal, { color: chargeColor }]}>{chargeLabel}</Text>
              </View>
            </View>

            {/* Particle Controls */}
            <View style={A.particleControl}>
              {/* Neutrons Row */}
              <View style={A.particleRow}>
                <View style={{ flex: 1 }}>
                  <View style={A.rowHeader}>
                    <Text style={[A.particleLabel, { color: '#60a5fa' }]}>NEUTRONS</Text>
                    <Text style={A.particleCount}>{n} <Text style={{ color: COLORS.textTertiary }}>/ {targetStableN} target</Text></Text>
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

              {/* Electrons Row */}
              <View style={A.particleRow}>
                <View style={{ flex: 1 }}>
                  <View style={A.rowHeader}>
                    <Text style={[A.particleLabel, { color: '#34d399' }]}>ELECTRONS</Text>
                    <Text style={A.particleCount}>{e} <Text style={{ color: COLORS.textTertiary }}>/ {p} target</Text></Text>
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
                <LinearGradient colors={['rgba(52, 211, 153, 0.12)', 'rgba(52, 211, 153, 0.02)']} style={StyleSheet.absoluteFill} />
                <Text style={A.foundTxt}>✓ Synthesized & Discovered in Database</Text>
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
                    {isBalanced ? `Synthesize ${el.sym} (+50 XP)` : 'Balance Nucleus & Electron Shell'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </>
        ) : mode === 'fusion' ? (
          /* Nuclear Fusion Chamber Mode */
          <View style={A.fusionBox}>
            <Text style={A.fusionTitle}>NUCLEAR FUSION REACTION</Text>
            <Text style={A.fusionDesc}>Combine two lighter discovered elements to synthesize {el.nameEn}:</Text>
            
            <View style={A.fusionEquationRow}>
              {/* Precursor A */}
              <View style={A.fusionItem}>
                <TouchableOpacity onPress={() => setFusionA(prev => Math.max(1, (prev % (p - 1)) + 1))}>
                  <View style={[A.fusionSymBox, { borderColor: found.includes(fusionA) ? getCategoryColor(getElement(fusionA).category) : COLORS.border }]}>
                    <Text style={A.fusionSym}>{getElement(fusionA).sym}</Text>
                    <Text style={A.fusionZ}>Z={fusionA}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={A.fusionPlus}>+</Text>

              {/* Precursor B */}
              <View style={A.fusionItem}>
                <TouchableOpacity onPress={() => setFusionB(prev => Math.max(1, (prev % (p - 1)) + 1))}>
                  <View style={[A.fusionSymBox, { borderColor: found.includes(fusionB) ? getCategoryColor(getElement(fusionB).category) : COLORS.border }]}>
                    <Text style={A.fusionSym}>{getElement(fusionB).sym}</Text>
                    <Text style={A.fusionZ}>Z={fusionB}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={A.fusionPlus}>➔</Text>

              {/* Target Element */}
              <View style={A.fusionItem}>
                <View style={[A.fusionSymBox, { borderColor: cat, backgroundColor: cat + '15' }]}>
                  <Text style={[A.fusionSym, { color: cat }]}>{el.sym}</Text>
                  <Text style={A.fusionZ}>Z={p}</Text>
                </View>
              </View>
            </View>

            {/* Fusion Status Feedback */}
            <Text style={[A.fusionFeedback, { color: isFusionValid ? COLORS.success : '#f87171' }]}>
              {fusionA + fusionB !== p
                ? `Protons mismatch: ${fusionA} + ${fusionB} = ${fusionA + fusionB} (Need ${p})`
                : !found.includes(fusionA)
                ? `Precursor ${getElement(fusionA).nameEn} not yet discovered!`
                : !found.includes(fusionB)
                ? `Precursor ${getElement(fusionB).nameEn} not yet discovered!`
                : 'Reaction Balanced: Ready for High-Energy Fusion!'}
            </Text>

            {isFound ? (
              <View style={A.foundBadge}>
                <Text style={A.foundTxt}>✓ Already Discovered</Text>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={handleFusionSynthesize} 
                activeOpacity={0.85}
                disabled={!isFusionValid}
              >
                <LinearGradient
                  colors={isFusionValid ? ['#e11d48', '#a855f7'] : ['#2f3640', '#1f242d']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={A.discoverBtn}
                >
                  <Text style={[A.discoverTxt, { color: isFusionValid ? '#FFFFFF' : COLORS.textTertiary }]}>
                    {isFusionValid ? `Ignite Nuclear Fusion (+50 XP)` : 'Adjust Precursors to Match Z'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* Molecular Compounds Mode */
          <View style={A.compoundLabContainer}>
            <Text style={A.fusionTitle}>MOLECULAR BONDING LAB</Text>
            <Text style={A.fusionDesc}>Select atom quantities in reaction vessel:</Text>

            {/* Atom selection grid */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={A.compoundAtomScroll}>
              {COMPOUND_ELEMENTS.map(cz => {
                const cel = getElement(cz);
                const count = compoundVessel[cz] || 0;
                return (
                  <View key={cz} style={A.compoundAtomCard}>
                    <Text style={A.compoundAtomSym}>{cel.sym}</Text>
                    <Text style={A.compoundAtomCount}>{count}</Text>
                    <View style={A.compoundAtomBtnRow}>
                      <TouchableOpacity style={A.compoundMiniBtn} onPress={() => updateVessel(cz, -1)}>
                        <Text style={A.compoundMiniBtnTxt}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={A.compoundMiniBtn} onPress={() => updateVessel(cz, 1)}>
                        <Text style={A.compoundMiniBtnTxt}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Vessel Formula Feedback */}
            <View style={A.compoundStatusCard}>
              <Text style={A.compoundDetected}>
                {matchedCompound 
                  ? `✨ Matched: ${matchedCompound.name} (${matchedCompound.formula})` 
                  : 'Vessel contents: Unknown mixture'}
              </Text>
              {matchedCompound && (
                <Text style={A.compoundBondType}>Bond Type: {matchedCompound.bondType.replace('_', ' ').toUpperCase()}</Text>
              )}
            </View>

            <TouchableOpacity 
              onPress={handleCompoundSynthesize} 
              activeOpacity={0.85}
              disabled={!matchedCompound}
            >
              <LinearGradient
                colors={matchedCompound ? ['#059669', '#10b981'] : ['#2f3640', '#1f242d']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={A.discoverBtn}
              >
                <Text style={[A.discoverTxt, { color: matchedCompound ? '#FFFFFF' : COLORS.textTertiary }]}>
                  {matchedCompound ? `Synthesize ${matchedCompound.formula} (+${matchedCompound.xpReward} XP)` : 'Adjust Recipe to Match Compound'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Full-Screen Congratulatory Discovery Modal (Elements) */}
      {showCongrats !== null && (
        <Modal transparent animationType="fade" visible={showCongrats !== null}>
          <View style={A.modalOverlay}>
            <View style={A.modalBox}>
              <LinearGradient colors={['rgba(10,14,26,0.98)', 'rgba(10,14,26,1.0)']} style={StyleSheet.absoluteFill} />
              
              <Text style={A.congratsTitle}>✨ ELEMENT DISCOVERED ✨</Text>
              
              <View style={[A.congratsSymBox, { borderColor: cat, backgroundColor: cat + '15' }]}>
                <Text style={[A.congratsSym, { color: cat }]}>{getElement(showCongrats).sym}</Text>
              </View>

              <Text style={A.congratsName}>{getElement(showCongrats).nameEn}</Text>
              <Text style={A.congratsSub}>{getElement(showCongrats).category} &bull; Z = {showCongrats} &bull; Mass = {getElement(showCongrats).mass.toFixed(2)} u</Text>

              {/* Rich Lore / History Card */}
              <View style={A.loreCard}>
                <Text style={A.loreTitle}>SCIENCE DOSSIER</Text>
                <Text style={A.loreText}>{getElement(showCongrats).desc}</Text>
                <View style={A.loreMetaRow}>
                  <Text style={A.loreMeta}>Discovery: {getElement(showCongrats).discovered}</Text>
                  <Text style={A.loreMeta}>{getElement(showCongrats).discoveredBy || 'Historical'}</Text>
                </View>
              </View>

              <View style={A.rewardsCard}>
                <Text style={A.rewardXP}>+50 Discovery XP Gained</Text>
                <Text style={A.rewardText}>Unlocked in Periodic Table & Mastered in Quiz Pool!</Text>
              </View>

              <TouchableOpacity 
                style={[A.confirmBtn, { backgroundColor: cat }]}
                onPress={() => setShowCongrats(null)}
              >
                <Text style={A.confirmBtnTxt}>Accept & Inspect Element</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Full-Screen Compound Synthesis Modal */}
      {synthesizedCompound !== null && (
        <Modal transparent animationType="fade" visible={synthesizedCompound !== null}>
          <View style={A.modalOverlay}>
            <View style={A.modalBox}>
              <LinearGradient colors={['rgba(10,14,26,0.98)', 'rgba(10,14,26,1.0)']} style={StyleSheet.absoluteFill} />
              
              <Text style={[A.congratsTitle, { color: '#34d399' }]}>🧪 MOLECULE SYNTHESIZED 🧪</Text>
              
              <View style={[A.congratsSymBox, { borderColor: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.12)' }]}>
                <Text style={[A.congratsSym, { color: '#34d399', fontSize: 24 }]}>{synthesizedCompound.formula}</Text>
              </View>

              <Text style={A.congratsName}>{synthesizedCompound.name}</Text>
              <Text style={A.congratsSub}>{synthesizedCompound.bondType.toUpperCase()} BOND</Text>

              <View style={A.loreCard}>
                <Text style={A.loreTitle}>MOLECULAR DOSSIER</Text>
                <Text style={A.loreText}>{synthesizedCompound.desc}</Text>
              </View>

              <View style={A.rewardsCard}>
                <Text style={A.rewardXP}>+{synthesizedCompound.xpReward} Research XP Gained</Text>
                <Text style={A.rewardText}>Chemical bonding complete.</Text>
              </View>

              <TouchableOpacity 
                style={[A.confirmBtn, { backgroundColor: '#34d399' }]}
                onPress={() => setSynthesizedCompound(null)}
              >
                <Text style={[A.confirmBtnTxt, { color: '#0a0e1a' }]}>Accept Molecule</Text>
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
    paddingTop: 50,
    paddingBottom: 110,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  stage: { 
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

  modeTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.sm,
    padding: 3,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: RADIUS.sm - 2,
  },
  modeTabActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  modeTabTxt: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  modeTabTxtActive: {
    color: COLORS.primaryLight,
  },

  bottom: {
    borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 12, overflow: 'hidden',
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
    justifyContent: 'space-between',
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

  // Telemetry row
  telemetryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  telemetryBadge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  telemetryLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  telemetryVal: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Particle controls
  particleControl: {
    marginBottom: 10,
    gap: 5,
  },
  particleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: RADIUS.md,
    padding: 7,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 8,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  particleLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  particleCount: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  track: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 2 },
  rowControls: {
    flexDirection: 'row',
    gap: 6,
  },
  adjustBtn: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adjustTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  discoverBtn: { borderRadius: RADIUS.md, padding: 11, alignItems: 'center', ...SHADOWS.glow },
  discoverTxt: { fontSize: 12.5, fontWeight: '800' },

  foundBadge: {
    borderRadius: RADIUS.md, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(52, 211, 153, 0.3)', overflow: 'hidden',
  },
  foundTxt: { fontSize: 11.5, fontWeight: '700', color: '#34d399' },

  // Fusion Chamber styles
  fusionBox: {
    paddingVertical: 2,
  },
  fusionTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  fusionDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  fusionEquationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  fusionItem: {
    alignItems: 'center',
  },
  fusionSymBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  fusionSym: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  fusionZ: {
    fontSize: 8,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  fusionPlus: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  fusionFeedback: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Compound Lab styles
  compoundLabContainer: {
    paddingVertical: 2,
  },
  compoundAtomScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  compoundAtomCard: {
    width: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 4,
    alignItems: 'center',
    marginRight: 6,
  },
  compoundAtomSym: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  compoundAtomCount: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryLight,
    marginVertical: 1,
  },
  compoundAtomBtnRow: {
    flexDirection: 'row',
    gap: 4,
  },
  compoundMiniBtn: {
    width: 18,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compoundMiniBtnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  compoundStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.sm,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    marginBottom: 8,
  },
  compoundDetected: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34d399',
  },
  compoundBondType: {
    fontSize: 8.5,
    color: COLORS.textTertiary,
    marginTop: 2,
  },

  // Congrats Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 26, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  congratsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fbbf24',
    textAlign: 'center',
    letterSpacing: 1.0,
    marginBottom: 14,
  },
  congratsSymBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  congratsSym: {
    fontSize: 28,
    fontWeight: '900',
  },
  congratsName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  congratsSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    marginBottom: 14,
    textAlign: 'center',
  },
  loreCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 12,
    width: '100%',
    marginBottom: 12,
  },
  loreTitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  loreText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  loreMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
    paddingTop: 6,
  },
  loreMeta: {
    fontSize: 9.5,
    color: COLORS.accent,
    fontWeight: '600',
  },
  rewardsCard: {
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    padding: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    gap: 3,
  },
  rewardText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  rewardXP: {
    fontSize: 14,
    fontWeight: '800',
    color: '#34d399',
  },
  confirmBtn: {
    width: '100%',
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  confirmBtnTxt: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#ffffff',
  },
});

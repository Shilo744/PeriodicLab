import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement } from '../data/elements';
import { COLORS, RADIUS, getCategoryColor, SHADOWS } from '../theme';
import { isElementUnlocked } from '../data/storage';


const CS = 32;
const GAP = 3;

const ROWS = [
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [3,4,0,0,0,0,0,0,0,0,0,0,5,6,7,8,9,10],
  [11,12,0,0,0,0,0,0,0,0,0,0,13,14,15,16,17,18],
  [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
  [37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
  [55,56,57,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86],
  [87,88,89,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118],
];

const CATS = [
  'Nonmetal', 'Noble gas', 'Alkali metal', 'Alkaline earth',
  'Metalloid', 'Post-transition', 'Transition metal', 'Halogen',
  'Actinide', 'Lanthanide', 'Unknown',
];

interface PeriodicTableProps {
  discovered: number[];
  levels: Record<number, number>;
  xp: number;
  onSelect?: (z: number) => void;
  onGoBuilder?: (z: number) => void;
}

export default function PeriodicTable({ discovered, levels, xp, onSelect, onGoBuilder }: PeriodicTableProps) {
  const [modalEl, setModalEl] = useState<number | null>(null);

  const handleCellPress = (z: number) => {
    const unlocked = isElementUnlocked(z, xp, levels);
    const found = discovered.includes(z);

    if (!unlocked || !found) {
      setModalEl(z);
    } else {
      onSelect?.(z);
    }
  };

  const renderModal = () => {
    if (!modalEl) return null;
    const el = getElement(modalEl);
    const unlocked = isElementUnlocked(modalEl, xp, levels);
    const prevEl = modalEl > 1 ? getElement(modalEl - 1) : null;
    const prevLvl = modalEl > 1 ? (levels[modalEl - 1] || 0) : 0;
    const reqXP = (modalEl - 3) * 120;
    const catColor = getCategoryColor(el.category);

    return (
      <View style={T.modalOverlay}>
        <View style={T.modalBox}>
          <LinearGradient colors={['rgba(11, 15, 38, 0.96)', 'rgba(5, 7, 20, 0.99)']} style={StyleSheet.absoluteFill} />
          
          <Text style={T.modalHeader}>{unlocked ? 'ELEMENT UNLOCKED' : 'ELEMENT LOCKED'}</Text>
          
          <View style={[T.modalSymBox, { borderColor: unlocked ? catColor + '80' : 'rgba(255,255,255,0.08)' }]}>
            <Text style={[T.modalSym, { color: unlocked ? catColor : '#475569' }]}>
              {unlocked ? el.sym : '?'}
            </Text>
          </View>
          
          <Text style={T.modalName}>
            {unlocked ? el.nameEn : `Element Z = ${modalEl}`}
          </Text>

          {unlocked ? (
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={T.modalDesc}>
                This element is unlocked! Build and synthesize its atom in the Builder to register its properties and add it to study lists.
              </Text>
              {onGoBuilder && (
                <TouchableOpacity 
                  style={[T.actionBtn, { backgroundColor: catColor }]}
                  onPress={() => {
                    setModalEl(null);
                    onGoBuilder(modalEl);
                  }}
                >
                  <Text style={T.actionBtnTxt}>Go to Builder</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ width: '100%' }}>
              <Text style={T.modalDescLocked}>
                To unlock this element, complete one of the following requirements:
              </Text>
              
              <View style={T.reqRow}>
                <Text style={T.reqDot}>•</Text>
                <Text style={T.reqText}>
                  Master {prevEl?.nameEn} ({prevEl?.sym}) to Level 2 (Current: Level {prevLvl})
                </Text>
              </View>

              <View style={T.reqRow}>
                <Text style={T.reqDot}>•</Text>
                <Text style={T.reqText}>
                  Earn {reqXP} total XP (Current XP: {xp})
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={T.closeBtn} onPress={() => setModalEl(null)}>
            <Text style={T.closeBtnTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={T.wrap}>
      <LinearGradient colors={['rgba(99, 102, 241, 0.1)', 'transparent']} style={T.headGrad}>
        <Text style={T.title}>Periodic Table</Text>
        <Text style={T.sub}>{discovered.length}/118 discovered</Text>
        <View style={T.legend}>
          {CATS.map(cat => (
            <View key={cat} style={T.legItem}>
              <View style={[T.legDot, { backgroundColor: getCategoryColor(cat) }]} />
              <Text style={T.legLabel}>{cat}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={T.table}>
            {ROWS.map((row, ri) => (
              <View key={ri} style={T.row}>
                <Text style={T.rowNum}>{ri + 1}</Text>
                {row.map((z, ci) => {
                  if (z === 0) return <View key={ci} style={[T.cell, T.blank]} />;
                  const el = getElement(z);
                  const found = discovered.includes(z);
                  const unlocked = isElementUnlocked(z, xp, levels);
                  const cat = getCategoryColor(el.category);
                  const lvl = levels[z] || 0;
                  
                  return (
                    <TouchableOpacity
                      key={ci}
                      onPress={() => handleCellPress(z)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        T.cell, 
                        found ? {
                          backgroundColor: cat + '15',
                          borderColor: cat + '80',
                          shadowColor: cat,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.15,
                          shadowRadius: 4,
                        } : unlocked ? {
                          backgroundColor: 'rgba(6, 182, 212, 0.04)',
                          borderColor: 'rgba(6, 182, 212, 0.5)',
                          borderStyle: 'dashed',
                        } : {
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          borderColor: 'rgba(255,255,255,0.06)',
                        }
                      ]}>
                        {found ? (
                          <>
                            <Text style={[T.num, { color: cat }]}>{z}</Text>
                            <Text style={[T.sym, { color: cat }]}>{el.sym}</Text>
                            {lvl > 0 && (
                              <View style={[T.lvlBadgeBox, { backgroundColor: cat + '22' }]}>
                                <Text style={[T.lvlBadgeTxt, { color: cat }]}>L{lvl}</Text>
                              </View>
                            )}
                          </>
                        ) : unlocked ? (
                          <>
                            <Text style={[T.num, { color: 'rgba(6, 182, 212, 0.6)' }]}>{z}</Text>
                            <Text style={T.symReady}>?</Text>
                            <View style={T.pulseDot} />
                          </>
                        ) : (
                          <>
                            <Text style={T.numLocked}>{z}</Text>
                            <Text style={T.symLocked}>{el.sym}</Text>
                          </>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={T.footer}>
            <View style={T.footerGrad}>
              <LinearGradient colors={['rgba(99, 102, 241, 0.08)', 'transparent']} style={StyleSheet.absoluteFill} />
              <Text style={T.footerTitle}>Lanthanides</Text>
            </View>
            <View style={T.lantRow}>
              {Array.from({ length: 15 }, (_, i) => {
                const z = 57 + i;
                const el = getElement(z);
                const found = discovered.includes(z);
                const unlocked = isElementUnlocked(z, xp, levels);
                const cat = getCategoryColor(el.category);
                return (
                  <TouchableOpacity
                    key={z}
                    onPress={() => handleCellPress(z)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      T.lantCell, 
                      found ? {
                        backgroundColor: cat + '15',
                        borderColor: cat + '80',
                      } : unlocked ? {
                        backgroundColor: 'rgba(6, 182, 212, 0.04)',
                        borderColor: 'rgba(6, 182, 212, 0.5)',
                        borderStyle: 'dashed',
                      } : {
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        borderColor: 'rgba(255,255,255,0.04)',
                      }
                    ]}>
                      {found ? (
                        <Text style={[T.lantSym, { color: cat }]}>{el.sym}</Text>
                      ) : unlocked ? (
                        <Text style={T.symReadySmall}>?</Text>
                      ) : null}
                      <Text style={T.lantNum}>{z}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[T.footerGrad, { marginTop: 8 }]}>
              <LinearGradient colors={['rgba(168, 85, 247, 0.08)', 'transparent']} style={StyleSheet.absoluteFill} />
              <Text style={T.footerTitle}>Actinides</Text>
            </View>
            <View style={T.lantRow}>
              {Array.from({ length: 15 }, (_, i) => {
                const z = 89 + i;
                const el = getElement(z);
                const found = discovered.includes(z);
                const unlocked = isElementUnlocked(z, xp, levels);
                const cat = getCategoryColor(el.category);
                return (
                  <TouchableOpacity
                    key={z}
                    onPress={() => handleCellPress(z)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      T.lantCell, 
                      found ? {
                        backgroundColor: cat + '15',
                        borderColor: cat + '80',
                      } : unlocked ? {
                        backgroundColor: 'rgba(6, 182, 212, 0.04)',
                        borderColor: 'rgba(6, 182, 212, 0.5)',
                        borderStyle: 'dashed',
                      } : {
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        borderColor: 'rgba(255,255,255,0.04)',
                      }
                    ]}>
                      {found ? (
                        <Text style={[T.lantSym, { color: cat }]}>{el.sym}</Text>
                      ) : unlocked ? (
                        <Text style={T.symReadySmall}>?</Text>
                      ) : null}
                      <Text style={T.lantNum}>{z}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      {renderModal()}
    </View>
  );
}

const T = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.bg },
  headGrad: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  sub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, marginBottom: 8 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  legItem: { flexDirection: 'row', alignItems: 'center', marginRight: 6, marginBottom: 2 },
  legDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 2 },
  legLabel: { fontSize: 8, color: COLORS.textTertiary },

  table: { paddingHorizontal: 16, paddingTop: 10 },
  row: { flexDirection: 'row', marginBottom: GAP },
  rowNum: { width: 18, fontSize: 9, color: COLORS.textTertiary, textAlign: 'center', marginTop: 8 },
  cell: { width: CS, height: CS + 4, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: GAP, borderWidth: 1 },
  blank: { backgroundColor: 'transparent', borderWidth: 0 },
  num: { position: 'absolute', top: 2, left: 3, fontSize: 7, fontWeight: '600' },
  numLocked: { position: 'absolute', top: 2, left: 3, fontSize: 7, color: 'rgba(255,255,255,0.12)' },
  symLocked: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.08)' },
  sym: { fontSize: 13, fontWeight: '900', marginTop: -2 },
  symReady: { fontSize: 12, fontWeight: '900', color: 'rgba(6, 182, 212, 0.7)', marginTop: -2 },
  symReadySmall: { fontSize: 9, fontWeight: '900', color: 'rgba(6, 182, 212, 0.7)', marginTop: -1 },
  lvlBadgeBox: { position: 'absolute', bottom: 2, right: 2, borderRadius: 3, paddingHorizontal: 2, paddingVertical: 0.5 },
  lvlBadgeTxt: { fontSize: 5, fontWeight: '800' },
  pulseDot: { position: 'absolute', bottom: 3, right: 3, width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#00f5ff' },

  footer: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 40 },
  footerGrad: { borderRadius: RADIUS.sm, paddingVertical: 5, paddingHorizontal: 8, marginBottom: 4, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  footerTitle: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  lantRow: { flexDirection: 'row', gap: GAP, flexWrap: 'wrap' },
  lantCell: { width: CS, height: CS - 2, borderRadius: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: GAP },
  lantSym: { fontSize: 10, fontWeight: '900', marginTop: -2 },
  lantNum: { fontSize: 5.5, color: '#475569', position: 'absolute', bottom: 1, right: 2 },

  // Modal styling
  modalOverlay: {
    ...StyleSheet.absoluteFillObject as object,
    backgroundColor: 'rgba(5, 7, 20, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 100,
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
  modalHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1.0,
    marginBottom: 16,
  },
  modalSymBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  modalSym: {
    fontSize: 26,
    fontWeight: '800',
  },
  modalName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
  },
  modalDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalDescLocked: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  reqDot: {
    fontSize: 12,
    color: COLORS.accent,
    marginRight: 6,
    lineHeight: 16,
  },
  reqText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
  },
  actionBtnTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeBtn: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  closeBtnTxt: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
});

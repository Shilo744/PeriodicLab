import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, ELEMENTS } from '../data/elements';
import { COLORS, RADIUS, getCategoryColor, SHADOWS } from '../theme';
import { isElementUnlocked } from '../data/storage';
import ElementCompareModal from './ElementCompareModal';

const CS = 34;
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

const LANTHANIDES = [57,58,59,60,61,62,63,64,65,66,67,68,69,70,71];
const ACTINIDES = [89,90,91,92,93,94,95,96,97,98,99,100,101,102,103];

const FILTER_TAGS = [
  'All',
  'Discovered',
  'Nonmetal',
  'Noble gas',
  'Alkali metal',
  'Alkaline earth',
  'Metalloid',
  'Transition metal',
  'Post-transition',
  'Halogen',
  'Lanthanide',
  'Actinide',
  'Solid',
  'Liquid',
  'Gas'
];

interface PeriodicTableProps {
  discovered: number[];
  levels: Record<number, number>;
  xp: number;
  onSelect?: (z: number) => void;
  onGoBuilder?: (z: number) => void;
}

export default function PeriodicTable({ discovered, levels, xp, onSelect, onGoBuilder }: PeriodicTableProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedEl, setSelectedEl] = useState<number | null>(null);
  const [comparePair, setComparePair] = useState<[number, number] | null>(null);

  // Check matching criteria for any element Z
  const matchesSearchAndFilter = (z: number): boolean => {
    if (z === 0) return false;
    const el = getElement(z);

    // Search query filter
    if (search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      const matchSym = el.sym.toLowerCase().includes(q);
      const matchName = el.nameEn.toLowerCase().includes(q);
      const matchZ = el.z.toString() === q;
      if (!matchSym && !matchName && !matchZ) return false;
    }

    // Category / State filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Discovered') return discovered.includes(z);
    if (activeFilter === 'Solid') return el.state === 'solid';
    if (activeFilter === 'Liquid') return el.state === 'liquid';
    if (activeFilter === 'Gas') return el.state === 'gas';
    return el.category.toLowerCase() === activeFilter.toLowerCase();
  };

  const handleCellPress = (z: number) => {
    if (z > 0) {
      setSelectedEl(z);
    }
  };

  const renderQuickCardModal = () => {
    if (!selectedEl) return null;
    const el = getElement(selectedEl);
    const unlocked = isElementUnlocked(selectedEl, xp, levels);
    const isFound = discovered.includes(selectedEl);
    const catColor = getCategoryColor(el.category);
    const lvl = levels[selectedEl] || 0;
    const prevEl = selectedEl > 1 ? getElement(selectedEl - 1) : null;
    const prevLvl = selectedEl > 1 ? (levels[selectedEl - 1] || 0) : 0;
    const reqXP = (selectedEl - 3) * 120;

    return (
      <Modal transparent animationType="fade" visible={selectedEl !== null}>
        <View style={T.modalOverlay}>
          <View style={T.modalBox}>
            <LinearGradient colors={['rgba(10, 14, 26, 0.98)', 'rgba(10, 14, 26, 1.0)']} style={StyleSheet.absoluteFill} />

            {/* Header / Category Pill */}
            <View style={T.modalHeaderRow}>
              <View style={[T.modalCatPill, { backgroundColor: catColor + '18', borderColor: catColor + '40' }]}>
                <Text style={[T.modalCatText, { color: catColor }]}>{el.category.toUpperCase()}</Text>
              </View>
              <Text style={T.modalStatePill}>{el.state.toUpperCase()}</Text>
            </View>

            {/* Big Symbol & Name */}
            <View style={[T.modalSymBox, { borderColor: catColor, backgroundColor: catColor + '10' }]}>
              <Text style={[T.modalSym, { color: catColor }]}>{unlocked ? el.sym : '?'}</Text>
              <Text style={T.modalZ}>Z = {selectedEl}</Text>
            </View>

            <Text style={T.modalName}>{unlocked ? el.nameEn : `Element #${selectedEl}`}</Text>
            <Text style={T.modalMass}>Standard Atomic Mass: {el.mass.toFixed(3)} u</Text>

            {/* Status & Mastery Bar */}
            <View style={T.masteryRow}>
              <Text style={T.masteryText}>
                {isFound ? `✓ Discovered (Level ${lvl}/3)` : unlocked ? '⚡ Unlocked (Ready to synthesize)' : '🔒 Locked'}
              </Text>
            </View>

            {/* Properties Grid */}
            <View style={T.propsGrid}>
              <View style={T.propCell}>
                <Text style={T.propLabel}>Configuration</Text>
                <Text style={T.propVal}>{el.electronConfig}</Text>
              </View>
              <View style={T.propCell}>
                <Text style={T.propLabel}>Stable Neutrons</Text>
                <Text style={T.propVal}>{el.stableNeutrons}</Text>
              </View>
              <View style={T.propCell}>
                <Text style={T.propLabel}>Discovered</Text>
                <Text style={T.propVal}>{el.discovered}</Text>
              </View>
              <View style={T.propCell}>
                <Text style={T.propLabel}>Melting / Boiling</Text>
                <Text style={T.propVal}>{el.meltingPoint !== undefined ? `${el.meltingPoint}°C` : 'N/A'}</Text>
              </View>
            </View>

            {/* Lock Requirements if locked */}
            {!unlocked && (
              <View style={T.lockReqCard}>
                <Text style={T.lockReqTitle}>UNLOCK REQUIREMENTS</Text>
                <Text style={T.lockReqText}>• Master {prevEl?.nameEn} ({prevEl?.sym}) to Lvl 2 (Current: {prevLvl}/2)</Text>
                <Text style={T.lockReqText}>• Reach {reqXP} total XP (Current: {xp} XP)</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={T.modalActions}>
              <TouchableOpacity
                style={[T.actionBtn, { backgroundColor: 'rgba(34, 211, 238, 0.14)', borderColor: 'rgba(34, 211, 238, 0.4)' }]}
                onPress={() => {
                  setComparePair([selectedEl, selectedEl === 118 ? 117 : selectedEl + 1]);
                  setSelectedEl(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={[T.actionBtnTxt, { color: '#22d3ee' }]}>⚖ Compare</Text>
              </TouchableOpacity>
              {onSelect && (
                <TouchableOpacity
                  style={[T.actionBtn, { backgroundColor: 'rgba(99, 102, 241, 0.2)', borderColor: 'rgba(99, 102, 241, 0.4)' }]}
                  onPress={() => {
                    setSelectedEl(null);
                    onSelect(selectedEl);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[T.actionBtnTxt, { color: COLORS.primaryLight }]}>🔍 Study in 3D</Text>
                </TouchableOpacity>
              )}

              {onGoBuilder && (
                <TouchableOpacity
                  style={[T.actionBtn, { backgroundColor: catColor + '30', borderColor: catColor + '60' }]}
                  onPress={() => {
                    setSelectedEl(null);
                    onGoBuilder(selectedEl);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[T.actionBtnTxt, { color: catColor }]}>⚡ Builder & Fusion</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Close Button */}
            <TouchableOpacity style={T.closeBtn} onPress={() => setSelectedEl(null)}>
              <Text style={T.closeBtnTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={T.wrap}>
      {/* Header with Title & Stats */}
      <View style={T.headerSection}>
        <View style={T.titleRow}>
          <Text style={T.title}>Periodic Table</Text>
          <View style={T.statsBadge}>
            <Text style={T.statsText}>{discovered.length} / 118 Discovered</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={T.searchContainer}>
          <TextInput
            style={T.searchInput}
            placeholder="Search by symbol (Fe), name (Iron), or Z (26)..."
            placeholderTextColor={COLORS.textTertiary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity style={T.clearBtn} onPress={() => setSearch('')}>
              <Text style={T.clearBtnTxt}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips ScrollView */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={T.filterScroll}>
          {FILTER_TAGS.map(tag => {
            const isActive = activeFilter === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[T.filterChip, isActive && T.filterChipActive]}
                onPress={() => setActiveFilter(tag)}
                activeOpacity={0.8}
              >
                <Text style={[T.filterChipText, isActive && T.filterChipTextActive]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Interactive Matrix Grid ScrollViews */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={T.matrixScroll}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={T.matrixContent}>
          {/* Main 7 Periods */}
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
                  const isMatch = matchesSearchAndFilter(z);

                  return (
                    <TouchableOpacity
                      key={ci}
                      onPress={() => handleCellPress(z)}
                      activeOpacity={0.7}
                      style={{ opacity: isMatch ? 1.0 : 0.2 }}
                    >
                      <View style={[
                        T.cell,
                        found ? {
                          backgroundColor: cat + '22',
                          borderColor: isMatch && search ? '#fbbf24' : cat + '66',
                          borderWidth: isMatch && search ? 2 : 1,
                        } : unlocked ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          borderColor: isMatch && search ? '#fbbf24' : 'rgba(255, 255, 255, 0.15)',
                        } : {
                          backgroundColor: 'rgba(255, 255, 255, 0.01)',
                          borderColor: 'rgba(255, 255, 255, 0.04)',
                        }
                      ]}>
                        <Text style={[T.zNum, { color: found ? cat : COLORS.textTertiary }]}>{z}</Text>
                        <Text style={[T.sym, { color: found ? '#ffffff' : unlocked ? cat : '#475569' }]}>
                          {unlocked ? el.sym : '?'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Lanthanide & Actinide Sub-Blocks */}
          <View style={T.subBlockSection}>
            <View style={T.subBlockRow}>
              <Text style={T.subBlockLabel}>57-71</Text>
              {LANTHANIDES.map(z => {
                const el = getElement(z);
                const found = discovered.includes(z);
                const unlocked = isElementUnlocked(z, xp, levels);
                const cat = getCategoryColor(el.category);
                const isMatch = matchesSearchAndFilter(z);

                return (
                  <TouchableOpacity
                    key={z}
                    onPress={() => handleCellPress(z)}
                    activeOpacity={0.7}
                    style={{ opacity: isMatch ? 1.0 : 0.2 }}
                  >
                    <View style={[
                      T.cell,
                      found ? { backgroundColor: cat + '22', borderColor: cat + '66' } : { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }
                    ]}>
                      <Text style={[T.zNum, { color: found ? cat : COLORS.textTertiary }]}>{z}</Text>
                      <Text style={[T.sym, { color: found ? '#ffffff' : unlocked ? cat : '#475569' }]}>
                        {unlocked ? el.sym : '?'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={T.subBlockRow}>
              <Text style={T.subBlockLabel}>89-103</Text>
              {ACTINIDES.map(z => {
                const el = getElement(z);
                const found = discovered.includes(z);
                const unlocked = isElementUnlocked(z, xp, levels);
                const cat = getCategoryColor(el.category);
                const isMatch = matchesSearchAndFilter(z);

                return (
                  <TouchableOpacity
                    key={z}
                    onPress={() => handleCellPress(z)}
                    activeOpacity={0.7}
                    style={{ opacity: isMatch ? 1.0 : 0.2 }}
                  >
                    <View style={[
                      T.cell,
                      found ? { backgroundColor: cat + '22', borderColor: cat + '66' } : { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }
                    ]}>
                      <Text style={[T.zNum, { color: found ? cat : COLORS.textTertiary }]}>{z}</Text>
                      <Text style={[T.sym, { color: found ? '#ffffff' : unlocked ? cat : '#475569' }]}>
                        {unlocked ? el.sym : '?'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Render Quick Card Modal */}
      {renderQuickCardModal()}
      {comparePair && (
        <ElementCompareModal
          initialZA={comparePair[0]}
          initialZB={comparePair[1]}
          onClose={() => setComparePair(null)}
        />
      )}
    </View>
  );
}

const T = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: 50,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  statsBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  statsText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#34d399',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnTxt: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontWeight: '800',
  },

  filterScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: COLORS.primaryLight,
  },
  filterChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  filterChipTextActive: {
    color: COLORS.primaryLight,
  },

  matrixScroll: {
    flex: 1,
  },
  matrixContent: {
    padding: 12,
    paddingBottom: 120,
  },
  table: {
    gap: GAP,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
    alignItems: 'center',
  },
  rowNum: {
    width: 14,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  cell: {
    width: CS,
    height: CS + 4,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  blank: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  zNum: {
    fontSize: 7.5,
    fontWeight: '700',
  },
  sym: {
    fontSize: 11,
    fontWeight: '900',
  },

  subBlockSection: {
    marginTop: 14,
    gap: GAP,
    paddingLeft: 14,
  },
  subBlockRow: {
    flexDirection: 'row',
    gap: GAP,
    alignItems: 'center',
  },
  subBlockLabel: {
    width: 32,
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textTertiary,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 26, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  modalCatPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  modalCatText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalStatePill: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
  },
  modalSymBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalSym: {
    fontSize: 26,
    fontWeight: '900',
  },
  modalZ: {
    fontSize: 8.5,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  modalName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalMass: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  masteryRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
  },
  masteryText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
  },

  propsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '100%',
    marginBottom: 14,
  },
  propCell: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  propLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  propVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },

  lockReqCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: RADIUS.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    width: '100%',
    marginBottom: 12,
    gap: 3,
  },
  lockReqTitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#f87171',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  lockReqText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnTxt: {
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    paddingVertical: 6,
  },
  closeBtnTxt: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
});

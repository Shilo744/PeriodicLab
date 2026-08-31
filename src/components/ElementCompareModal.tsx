import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getElement, getCachedNeutrons, ELEMENTS } from '../data/elements';
import { COLORS, RADIUS, SHADOWS, getCategoryColor } from '../theme';

interface ElementCompareProps {
  initialZA?: number;
  initialZB?: number;
  onClose: () => void;
}

export default function ElementCompareModal({ initialZA = 11, initialZB = 17, onClose }: ElementCompareProps) {
  const [zA, setZA] = useState(initialZA); // e.g. Sodium (11)
  const [zB, setZB] = useState(initialZB); // e.g. Chlorine (17)

  const elA = getElement(zA);
  const elB = getElement(zB);
  const catA = getCategoryColor(elA.category);
  const catB = getCategoryColor(elB.category);

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View style={C.overlay}>
        <View style={C.box}>
          <LinearGradient colors={['rgba(10,14,26,0.98)', 'rgba(10,14,26,1.0)']} style={StyleSheet.absoluteFill} />

          {/* Header */}
          <View style={C.header}>
            <Text style={C.title}>SIDE-BY-SIDE ELEMENT COMPARISON</Text>
            <TouchableOpacity style={C.closeBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close element comparison">
              <Text style={C.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={C.scroll}>
            <View style={C.presets}>
              {[[1, 17, 'H–Cl'], [6, 8, 'C–O'], [26, 29, 'Fe–Cu']].map(([a, b, label]) => <TouchableOpacity key={String(label)} style={C.presetBtn} onPress={() => { setZA(Number(a)); setZB(Number(b)); }}><Text style={C.presetText}>{label}</Text></TouchableOpacity>)}
            </View>
            {/* Top Cards Comparison */}
          <View style={C.cardsRow}>
              {/* Element A */}
              <View style={[C.elCard, { borderColor: catA }]}>
                <Text style={[C.sym, { color: catA }]}>{elA.sym}</Text>
                <Text style={C.name}>{elA.nameEn}</Text>
                <Text style={C.meta}>Z = {zA} &bull; {elA.category}</Text>
                <View style={C.quickSwitchRow}>
                  <TouchableOpacity disabled={zA === 1} accessibilityRole="button" accessibilityLabel="Previous left element" style={[C.miniBtn, zA === 1 && { opacity: 0.35 }]} onPress={() => setZA(z => z - 1)}><Text style={C.miniBtnTxt}>-1</Text></TouchableOpacity>
                  <TouchableOpacity disabled={zA === 118} accessibilityRole="button" accessibilityLabel="Next left element" style={[C.miniBtn, zA === 118 && { opacity: 0.35 }]} onPress={() => setZA(z => z + 1)}><Text style={C.miniBtnTxt}>+1</Text></TouchableOpacity>
                </View>
              </View>

              {/* VS Divider */}
              <View style={C.vsBadge}>
                <Text style={C.vsTxt}>VS</Text>
                <TouchableOpacity
                  style={C.swapBtn}
                  onPress={() => { setZA(zB); setZB(zA); }}
                  accessibilityRole="button"
                  accessibilityLabel="Swap compared elements"
                >
                  <Text style={C.swapTxt}>⇄</Text>
                </TouchableOpacity>
              </View>

              {/* Element B */}
              <View style={[C.elCard, { borderColor: catB }]}>
                <Text style={[C.sym, { color: catB }]}>{elB.sym}</Text>
                <Text style={C.name}>{elB.nameEn}</Text>
                <Text style={C.meta}>Z = {zB} &bull; {elB.category}</Text>
                <View style={C.quickSwitchRow}>
                  <TouchableOpacity disabled={zB === 1} accessibilityRole="button" accessibilityLabel="Previous right element" style={[C.miniBtn, zB === 1 && { opacity: 0.35 }]} onPress={() => setZB(z => z - 1)}><Text style={C.miniBtnTxt}>-1</Text></TouchableOpacity>
                  <TouchableOpacity disabled={zB === 118} accessibilityRole="button" accessibilityLabel="Next right element" style={[C.miniBtn, zB === 118 && { opacity: 0.35 }]} onPress={() => setZB(z => z + 1)}><Text style={C.miniBtnTxt}>+1</Text></TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Comparison Metrics Matrix */}
            <View style={C.tableContainer}>
              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.mass.toFixed(2)} u</Text>
                <Text style={C.colLabel}>ATOMIC MASS</Text>
                <Text style={C.colVal}>{elB.mass.toFixed(2)} u</Text>
              </View>
              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.density !== undefined ? `${elA.density} g/cm³` : 'N/A'}</Text>
                <Text style={C.colLabel}>DENSITY</Text>
                <Text style={C.colVal}>{elB.density !== undefined ? `${elB.density} g/cm³` : 'N/A'}</Text>
              </View>

              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.electronegativity ?? 'N/A'}</Text>
                <Text style={C.colLabel}>ELECTRONEGATIVITY (χ)</Text>
                <Text style={C.colVal}>{elB.electronegativity ?? 'N/A'}</Text>
              </View>

              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.electronConfig}</Text>
                <Text style={C.colLabel}>CONFIGURATION</Text>
                <Text style={C.colVal}>{elB.electronConfig}</Text>
              </View>

              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.shells[elA.shells.length - 1]} e⁻</Text>
                <Text style={C.colLabel}>OUTERMOST SHELL ELECTRONS</Text>
                <Text style={C.colVal}>{elB.shells[elB.shells.length - 1]} e⁻</Text>
              </View>

              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.state.toUpperCase()}</Text>
                <Text style={C.colLabel}>STP STATE</Text>
                <Text style={C.colVal}>{elB.state.toUpperCase()}</Text>
              </View>

              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.meltingPoint !== undefined ? `${elA.meltingPoint}°C` : 'N/A'}</Text>
                <Text style={C.colLabel}>MELTING POINT</Text>
                <Text style={C.colVal}>{elB.meltingPoint !== undefined ? `${elB.meltingPoint}°C` : 'N/A'}</Text>
              </View>
              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.boilingPoint !== undefined ? `${elA.boilingPoint}°C` : 'N/A'}</Text>
                <Text style={C.colLabel}>BOILING POINT</Text>
                <Text style={C.colVal}>{elB.boilingPoint !== undefined ? `${elB.boilingPoint}°C` : 'N/A'}</Text>
              </View>
              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.atomicRadius ? `${elA.atomicRadius} pm` : 'N/A'}</Text>
                <Text style={C.colLabel}>ATOMIC RADIUS</Text>
                <Text style={C.colVal}>{elB.atomicRadius ? `${elB.atomicRadius} pm` : 'N/A'}</Text>
              </View>
              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.ionizationEnergy ? `${elA.ionizationEnergy} kJ/mol` : 'N/A'}</Text>
                <Text style={C.colLabel}>IONIZATION ENERGY</Text>
                <Text style={C.colVal}>{elB.ionizationEnergy ? `${elB.ionizationEnergy} kJ/mol` : 'N/A'}</Text>
              </View>
              <View style={C.tableRow}>
                <Text style={C.colVal}>{elA.crystalStructure ?? 'N/A'}</Text>
                <Text style={C.colLabel}>CRYSTAL STRUCTURE</Text>
                <Text style={C.colVal}>{elB.crystalStructure ?? 'N/A'}</Text>
              </View>
            </View>

            {/* Electronegativity Difference & Bond Characterization */}
            {elA.electronegativity !== undefined && elB.electronegativity !== undefined && (
              <View style={C.bondCard}>
                <Text style={C.bondTitle}>ELECTRONEGATIVITY DIFFERENCE</Text>
                <Text style={C.bondDiff}>Δχ = {Math.abs(elA.electronegativity - elB.electronegativity).toFixed(2)}</Text>
                <Text style={C.bondType}>
                  This is a comparison of tabulated values, not a prediction of a specific compound or bond.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const C = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 26, 0.85)',
    justifyContent: 'flex-end',
  },
  box: {
    height: '82%',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    padding: 16,
    paddingBottom: 60,
  },
  presets: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  presetBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  presetText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '800' },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  elCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
  },
  sym: {
    fontSize: 32,
    fontWeight: '900',
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  meta: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 1,
    textAlign: 'center',
  },
  quickSwitchRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  miniBtn: {
    minWidth: 36,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniBtnTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  vsBadge: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsTxt: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textTertiary,
  },
  swapBtn: { marginTop: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(34,211,238,0.12)', alignItems: 'center', justifyContent: 'center' },
  swapTxt: { color: '#22d3ee', fontSize: 17, fontWeight: '900' },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 8,
    gap: 6,
    marginBottom: 14,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  colLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textTertiary,
    textAlign: 'center',
    width: '40%',
  },
  colVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    width: '30%',
    textAlign: 'center',
  },
  bondCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    padding: 12,
    alignItems: 'center',
  },
  bondTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 0.8,
  },
  bondDiff: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fbbf24',
    marginVertical: 4,
  },
  bondType: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    fontWeight: '700',
    color: '#34d399',
  },
});

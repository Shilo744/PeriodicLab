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
    <Modal transparent animationType="slide" visible>
      <View style={C.overlay}>
        <View style={C.box}>
          <LinearGradient colors={['rgba(10,14,26,0.98)', 'rgba(10,14,26,1.0)']} style={StyleSheet.absoluteFill} />

          {/* Header */}
          <View style={C.header}>
            <Text style={C.title}>SIDE-BY-SIDE ELEMENT COMPARISON</Text>
            <TouchableOpacity style={C.closeBtn} onPress={onClose}>
              <Text style={C.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={C.scroll}>
            {/* Top Cards Comparison */}
            <View style={C.cardsRow}>
              {/* Element A */}
              <View style={[C.elCard, { borderColor: catA }]}>
                <Text style={[C.sym, { color: catA }]}>{elA.sym}</Text>
                <Text style={C.name}>{elA.nameEn}</Text>
                <Text style={C.meta}>Z = {zA} &bull; {elA.category}</Text>
                <View style={C.quickSwitchRow}>
                  <TouchableOpacity style={C.miniBtn} onPress={() => setZA(z => Math.max(1, z - 1))}><Text style={C.miniBtnTxt}>-1</Text></TouchableOpacity>
                  <TouchableOpacity style={C.miniBtn} onPress={() => setZA(z => Math.min(118, z + 1))}><Text style={C.miniBtnTxt}>+1</Text></TouchableOpacity>
                </View>
              </View>

              {/* VS Divider */}
              <View style={C.vsBadge}>
                <Text style={C.vsTxt}>VS</Text>
              </View>

              {/* Element B */}
              <View style={[C.elCard, { borderColor: catB }]}>
                <Text style={[C.sym, { color: catB }]}>{elB.sym}</Text>
                <Text style={C.name}>{elB.nameEn}</Text>
                <Text style={C.meta}>Z = {zB} &bull; {elB.category}</Text>
                <View style={C.quickSwitchRow}>
                  <TouchableOpacity style={C.miniBtn} onPress={() => setZB(z => Math.max(1, z - 1))}><Text style={C.miniBtnTxt}>-1</Text></TouchableOpacity>
                  <TouchableOpacity style={C.miniBtn} onPress={() => setZB(z => Math.min(118, z + 1))}><Text style={C.miniBtnTxt}>+1</Text></TouchableOpacity>
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
                <Text style={C.colLabel}>VALENCE ELECTRONS</Text>
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
            </View>

            {/* Electronegativity Difference & Bond Characterization */}
            {elA.electronegativity !== undefined && elB.electronegativity !== undefined && (
              <View style={C.bondCard}>
                <Text style={C.bondTitle}>BOND CHARACTER PREDICTION</Text>
                <Text style={C.bondDiff}>Δχ = {Math.abs(elA.electronegativity - elB.electronegativity).toFixed(2)}</Text>
                <Text style={C.bondType}>
                  {Math.abs(elA.electronegativity - elB.electronegativity) > 2.0
                    ? '✨ Pure Ionic Bond Lattice (High Polarity)'
                    : Math.abs(elA.electronegativity - elB.electronegativity) >= 0.4
                    ? '⚡ Polar Covalent Molecule Bond'
                    : '🔗 Nonpolar / Pure Covalent Sharing'}
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
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 30,
    height: 30,
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
    fontWeight: '700',
    color: '#34d399',
  },
});

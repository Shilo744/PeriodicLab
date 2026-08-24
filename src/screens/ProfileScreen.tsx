import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ELEMENTS, ElementCategory } from '../data/elements';
import { COLORS, RADIUS, SHADOWS, getCategoryColor } from '../theme';
import { Locale, t } from '../data/i18n';

interface ProfileScreenProps {
  xp: number;
  discovered: number[];
  levels: Record<number, number>;
  dailyStreak: number;
  unlockedAchievementsCount: number;
  locale: Locale;
  onClose: () => void;
}

const CATEGORIES: { key: ElementCategory; label: string }[] = [
  { key: 'Alkali metal', label: 'Alkali Metals' },
  { key: 'Alkaline earth', label: 'Alkaline Earth' },
  { key: 'Transition metal', label: 'Transition Metals' },
  { key: 'Post-transition', label: 'Post-Transition' },
  { key: 'Metalloid', label: 'Metalloids' },
  { key: 'Nonmetal', label: 'Reactive Nonmetals' },
  { key: 'Noble gas', label: 'Noble Gases' },
  { key: 'Lanthanide', label: 'Lanthanides' },
  { key: 'Actinide', label: 'Actinides' },
];

export default function ProfileScreen({
  xp,
  discovered,
  levels,
  dailyStreak,
  unlockedAchievementsCount,
  locale,
  onClose,
}: ProfileScreenProps) {
  const discoveredSet = new Set(discovered);
  const masteredCount = Object.values(levels).filter(lvl => lvl >= 2).length;

  return (
    <View style={P.wrap}>
      <LinearGradient colors={['rgba(10,14,26,0.95)', 'rgba(10,14,26,1.0)']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={P.header}>
        <View>
          <Text style={P.title}>LABORATORY DOSSIER</Text>
          <Text style={P.sub}>Scientist Research Record</Text>
        </View>
        <TouchableOpacity style={P.closeBtn} onPress={onClose}>
          <Text style={P.closeTxt}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={P.scroll} showsVerticalScrollIndicator={false}>
        {/* Core Stats Overview */}
        <View style={P.statsRow}>
          <View style={P.statBox}>
            <Text style={P.statVal}>{discovered.length}</Text>
            <Text style={P.statLbl}>Discovered</Text>
            <Text style={P.statSub}>/ 118 Elements</Text>
          </View>
          <View style={P.statBox}>
            <Text style={[P.statVal, { color: '#34d399' }]}>{masteredCount}</Text>
            <Text style={P.statLbl}>Mastered</Text>
            <Text style={P.statSub}>Lvl 2+ Quizzes</Text>
          </View>
          <View style={P.statBox}>
            <Text style={[P.statVal, { color: '#fbbf24' }]}>🔥 {dailyStreak}</Text>
            <Text style={P.statLbl}>Streak</Text>
            <Text style={P.statSub}>Days Active</Text>
          </View>
        </View>

        {/* Chemical Family Breakdown */}
        <Text style={P.sectionHeading}>PERIODIC FAMILIES MASTERY</Text>
        <View style={P.familiesGrid}>
          {CATEGORIES.map(cat => {
            const catElements = ELEMENTS.filter(e => e.category === cat.key);
            const catDiscovered = catElements.filter(e => discoveredSet.has(e.z)).length;
            const pct = Math.round((catDiscovered / Math.max(1, catElements.length)) * 100);
            const color = getCategoryColor(cat.key);

            return (
              <View key={cat.key} style={P.familyCard}>
                <View style={P.familyHeader}>
                  <View style={[P.colorDot, { backgroundColor: color }]} />
                  <Text style={P.familyName}>{cat.label}</Text>
                  <Text style={P.familyCount}>{catDiscovered}/{catElements.length}</Text>
                </View>
                <View style={P.barTrack}>
                  <View style={[P.barFill, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Achievements Badge Card */}
        <View style={P.achCard}>
          <Text style={P.achTitle}>RESEARCH RECOGNITION</Text>
          <Text style={P.achMeta}>{unlockedAchievementsCount} Badges Unlocked &bull; {xp} Total XP Accumulated</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const P = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    fontSize: 20,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statSub: {
    fontSize: 8.5,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  familiesGrid: {
    gap: 8,
    marginBottom: 20,
  },
  familyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  familyName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  familyCount: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  barTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  achCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    padding: 14,
    alignItems: 'center',
  },
  achTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 0.8,
  },
  achMeta: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

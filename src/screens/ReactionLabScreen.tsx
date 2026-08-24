import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChemicalReaction, REACTIONS } from '../data/reactions';
import { COLORS, RADIUS } from '../theme';
import { playSound, triggerHaptic } from '../services/feedback';

type ReactionType = ChemicalReaction['type'] | 'all';
const TYPES: ReactionType[] = ['all', 'combustion', 'synthesis', 'neutralization', 'redox'];

export default function ReactionLabScreen({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<ReactionType>('all');
  const [selected, setSelected] = useState<string>(REACTIONS[0].id);
  const visible = useMemo(() => filter === 'all' ? REACTIONS : REACTIONS.filter(r => r.type === filter), [filter]);

  const runReaction = (reaction: ChemicalReaction) => {
    setSelected(reaction.id);
    triggerHaptic('success');
    playSound(reaction.type === 'combustion' ? 'fusion' : 'synthesize');
  };

  return (
    <View style={S.root}>
      <LinearGradient colors={['#07111f', COLORS.bg]} style={StyleSheet.absoluteFill} />
      <View style={S.header}>
        <View><Text style={S.title}>REACTION LAB</Text><Text style={S.subtitle}>Explore balanced chemical equations</Text></View>
        <TouchableOpacity onPress={onClose} style={S.close}><Text style={S.closeText}>✕</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.filters} contentContainerStyle={S.filterContent}>
        {TYPES.map(type => <TouchableOpacity key={type} onPress={() => setFilter(type)} style={[S.chip, filter === type && S.chipActive]}><Text style={[S.chipText, filter === type && S.chipTextActive]}>{type.toUpperCase()}</Text></TouchableOpacity>)}
      </ScrollView>
      <ScrollView contentContainerStyle={S.list}>
        {visible.map(reaction => {
          const active = selected === reaction.id;
          return <TouchableOpacity key={reaction.id} onPress={() => runReaction(reaction)} style={[S.card, active && S.cardActive]} activeOpacity={0.82}>
            <Text style={S.kind}>{reaction.type.toUpperCase()} · +{reaction.xpReward} XP</Text>
            <Text style={S.name}>{reaction.name}</Text>
            <Text style={S.equation}>{reaction.equation}</Text>
            {active && <View style={S.details}><Text style={S.enthalpy}>{reaction.enthalpy}</Text><Text style={S.description}>{reaction.description}</Text></View>}
          </TouchableOpacity>;
        })}
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 42 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },
  close: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: COLORS.textSecondary, fontWeight: '800' },
  filters: { flexGrow: 0, marginTop: 18 }, filterContent: { paddingHorizontal: 20, gap: 8 },
  chip: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 7 },
  chipActive: { borderColor: COLORS.primaryLight, backgroundColor: 'rgba(99,102,241,0.18)' },
  chipText: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '800' }, chipTextActive: { color: COLORS.primaryLight },
  list: { padding: 20, paddingBottom: 60, gap: 12 },
  card: { borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgCard, padding: 16 },
  cardActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(99,102,241,0.10)' },
  kind: { color: COLORS.primaryLight, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  name: { color: COLORS.text, fontSize: 15, fontWeight: '800', marginTop: 5 },
  equation: { color: '#34d399', fontSize: 19, fontWeight: '900', marginTop: 10 },
  details: { borderTopWidth: 1, borderTopColor: COLORS.borderLight, marginTop: 12, paddingTop: 10 },
  enthalpy: { color: '#fbbf24', fontSize: 11, fontWeight: '700' }, description: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 5 },
});

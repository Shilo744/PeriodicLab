import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChemicalReaction, REACTIONS } from '../data/reactions';
import { COLORS, RADIUS } from '../theme';
import { playSound, triggerHaptic } from '../services/feedback';
import { loadFavoriteReactions, saveFavoriteReactions } from '../data/storage';
import { matchesReactionQuery } from '../data/reactionSearch';
import { randomAlternative } from '../utils/random';
import { reactionBalance } from '../data/reactionBalance';

type ReactionType = ChemicalReaction['type'] | 'all';
const TYPES: ReactionType[] = ['all', 'combustion', 'synthesis', 'neutralization', 'redox'];

export default function ReactionLabScreen({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<ReactionType>('all');
  const [selected, setSelected] = useState<string>(REACTIONS[0].id);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [spotlight, setSpotlight] = useState<string | null>(null);
  const [alphabetical, setAlphabetical] = useState(false);
  const [showBrowseTools, setShowBrowseTools] = useState(false);
  const listRef = useRef<ScrollView>(null);
  const favoritesRef = useRef<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  useEffect(() => {
    let active = true;
    loadFavoriteReactions().then(ids => {
      if (!active) return;
      favoritesRef.current = ids.filter(id => REACTIONS.some(r => r.id === id));
      setFavorites(favoritesRef.current);
      setFavoritesReady(true);
    });
    return () => { active = false; };
  }, []);
  const toggleFavorite = (id: string) => {
    if (!favoritesReady) return;
    const previous = favoritesRef.current;
    const next = previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id];
    favoritesRef.current = next;
    setFavorites(next);
    void saveFavoriteReactions(next);
  };
  const visible = useMemo(() => {
    return REACTIONS.filter(r => (!favoritesOnly || favorites.includes(r.id)) && (filter === 'all' || r.type === filter) && matchesReactionQuery(r, query));
  }, [filter, query, favoritesOnly, favorites]);

  const runReaction = (reaction: ChemicalReaction) => {
    setSelected(reaction.id);
    triggerHaptic('success');
    playSound(reaction.type === 'combustion' ? 'fusion' : 'synthesize');
  };
  const pickRandom = () => {
    const choice = randomAlternative(visible, visible.find(r => r.id === selected));
    if (!choice) return;
    setSpotlight(choice.id);
    runReaction(choice);
    listRef.current?.scrollTo({ y: 0, animated: true });
  };
  const ordered = [...visible].sort((a, b) => Number(b.id === spotlight) - Number(a.id === spotlight) || (alphabetical ? a.name.localeCompare(b.name) : 0));

  return (
    <View style={S.root}>
      <LinearGradient colors={['#07111f', COLORS.bg]} style={StyleSheet.absoluteFill} />
      <View style={S.header}>
        <View><Text style={S.title}>See chemistry happen</Text><Text style={S.subtitle}>Open a reaction and follow where every atom goes.</Text></View>
        <View style={S.headerActions}><TouchableOpacity disabled={!visible.length} onPress={pickRandom} style={[S.surpriseBtn, !visible.length && { opacity: 0.4 }]} accessibilityRole="button" accessibilityLabel="Pick random matching reaction"><Text style={S.surpriseText}>Surprise me</Text></TouchableOpacity><TouchableOpacity onPress={onClose} style={S.close} accessibilityRole="button" accessibilityLabel="Close reaction lab"><Text style={S.closeText}>✕</Text></TouchableOpacity></View>
      </View>
      <View style={S.browseRow}>
        <Text style={S.resultCount}>{visible.length} experiments to explore</Text>
        <TouchableOpacity onPress={() => setShowBrowseTools(value => !value)} accessibilityRole="button"><Text style={S.browseToggle}>{showBrowseTools ? 'Hide browse tools' : 'Find a reaction +'}</Text></TouchableOpacity>
      </View>
      {showBrowseTools && <View>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search a name or formula" placeholderTextColor={COLORS.textTertiary} style={S.search} autoCorrect={false} accessibilityLabel="Search reactions" />
        <View style={S.toolRow}>
          <TouchableOpacity style={[S.favoriteFilter, favoritesOnly && S.favoriteFilterActive]} accessibilityRole="switch" accessibilityState={{ checked: favoritesOnly }} accessibilityLabel="Show favorite reactions only" onPress={() => setFavoritesOnly(value => !value)}><Text style={S.favoriteFilterText}>{favoritesOnly ? '★ Favorites' : '☆ Favorites'}</Text></TouchableOpacity>
          <TouchableOpacity style={S.favoriteFilter} accessibilityRole="switch" accessibilityState={{ checked: alphabetical }} accessibilityLabel="Sort reactions alphabetically" onPress={() => setAlphabetical(value => !value)}><Text style={S.favoriteFilterText}>{alphabetical ? 'A→Z order' : 'Catalog order'}</Text></TouchableOpacity>
          {(query || filter !== 'all' || favoritesOnly) && <TouchableOpacity style={S.favoriteFilter} accessibilityRole="button" accessibilityLabel="Clear reaction search and filters" onPress={() => { setQuery(''); setFilter('all'); setFavoritesOnly(false); setSpotlight(null); }}><Text style={S.favoriteFilterText}>Clear</Text></TouchableOpacity>}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.filters} contentContainerStyle={S.filterContent}>
          {TYPES.map(type => <TouchableOpacity key={type} onPress={() => setFilter(type)} style={[S.chip, filter === type && S.chipActive]} accessibilityRole="button" accessibilityState={{ selected: filter === type }} accessibilityLabel={`Filter reactions by ${type}`}><Text style={[S.chipText, filter === type && S.chipTextActive]}>{type.toUpperCase()}</Text></TouchableOpacity>)}
        </ScrollView>
      </View>}
      <ScrollView ref={listRef} contentContainerStyle={S.list}>
        {visible.length === 0 && <View style={S.empty}><Text style={S.emptyIcon}>⚗️</Text><Text style={S.emptyTitle}>No matching reactions</Text><Text style={S.emptyText}>Try another formula, category, or favorites filter.</Text></View>}
        {ordered.map(reaction => {
          const active = selected === reaction.id;
          return <View key={reaction.id} style={[S.card, active && S.cardActive]}>
            <View style={S.cardHeader}>
              <Text style={S.kind}>{reaction.type.toUpperCase()} · {active ? 'OPEN' : 'TAP TO EXPLORE'}</Text>
              <TouchableOpacity disabled={!favoritesReady} style={S.favoriteButton} accessibilityRole="button" accessibilityState={{ disabled: !favoritesReady, selected: favorites.includes(reaction.id) }} onPress={() => toggleFavorite(reaction.id)} accessibilityLabel={`${favorites.includes(reaction.id) ? 'Remove' : 'Add'} ${reaction.name} ${favorites.includes(reaction.id) ? 'from' : 'to'} favorites`}><Text style={S.star}>{favorites.includes(reaction.id) ? '★' : '☆'}</Text></TouchableOpacity>
            </View>
            <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: active }} accessibilityLabel={`${active ? 'Collapse' : 'Inspect'} ${reaction.name}`} onPress={() => active ? setSelected('') : runReaction(reaction)} activeOpacity={0.82}>
              <Text style={S.name}>{reaction.name}</Text>
              <Text style={S.equation}>{reaction.equation}</Text>
            </TouchableOpacity>
            {active && <View style={S.details}><Text style={S.detailTitle}>WHAT HAPPENS?</Text><Text style={S.description}>{reaction.description}</Text><Text style={S.enthalpy}>{reaction.enthalpy}</Text><Text style={S.detailTitle}>FOLLOW THE CHANGE</Text><Text style={S.description}>Start with: {reaction.reactants.map(item => `${item.count} × ${item.name}`).join(' + ')}</Text><Text style={S.description}>You get: {reaction.products.map(item => `${item.count} × ${item.name}`).join(' + ')}</Text></View>}
            {active && <View style={S.details}>
              <Text style={S.detailTitle}>WHY IT IS BALANCED</Text>
              {reactionBalance(reaction).rows.map(row => <Text key={row.symbol} style={S.description}>{row.symbol}: {row.reactants} / {row.products} {row.reactants === row.products ? '✓' : '≠'}</Text>)}
            </View>}
          </View>;
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
  headerActions: { flexDirection: 'row', gap: 8 },
  surpriseBtn: { paddingHorizontal: 12, height: 36, borderRadius: 18, backgroundColor: 'rgba(99,102,241,0.16)', borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)', alignItems: 'center', justifyContent: 'center' },
  surpriseText: { color: COLORS.primaryLight, fontSize: 10.5, fontWeight: '800' },
  search: { marginHorizontal: 20, marginTop: 16, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, color: COLORS.text, backgroundColor: COLORS.surface, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13 },
  favoriteFilter: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  favoriteFilterActive: { borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.10)' },
  favoriteFilterText: { color: '#fbbf24', fontSize: 10, fontWeight: '800' },
  browseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 14 },
  browseToggle: { color: COLORS.primaryLight, fontSize: 10.5, fontWeight: '800' },
  toolRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginHorizontal: 20, marginTop: 8 },
  resultCount: { color: COLORS.textTertiary, fontSize: 10, fontWeight: '700' },
  filters: { flexGrow: 0, marginTop: 10 }, filterContent: { paddingHorizontal: 20, gap: 8 },
  chip: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 7 },
  chipActive: { borderColor: COLORS.primaryLight, backgroundColor: 'rgba(99,102,241,0.18)' },
  chipText: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '800' }, chipTextActive: { color: COLORS.primaryLight },
  list: { padding: 20, paddingBottom: 60, gap: 12 },
  card: { borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgCard, padding: 16 },
  cardActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(99,102,241,0.10)' },
  kind: { color: COLORS.primaryLight, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  star: { color: '#fbbf24', fontSize: 22 },
  favoriteButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  name: { color: COLORS.text, fontSize: 15, fontWeight: '800', marginTop: 5 },
  equation: { color: '#34d399', fontSize: 19, fontWeight: '900', marginTop: 10 },
  details: { borderTopWidth: 1, borderTopColor: COLORS.borderLight, marginTop: 12, paddingTop: 10 },
  empty: { alignItems: 'center', paddingVertical: 52 }, emptyIcon: { fontSize: 34 }, emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginTop: 10 }, emptyText: { color: COLORS.textSecondary, fontSize: 12, marginTop: 5 },
  enthalpy: { color: '#fbbf24', fontSize: 11, fontWeight: '700' }, description: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 5 },
  detailTitle: { color: COLORS.primaryLight, fontSize: 9, fontWeight: '900', letterSpacing: 0.7, marginTop: 8 },
});

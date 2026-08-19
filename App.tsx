import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Line, Rect, Polyline } from 'react-native-svg';

import { getElement } from './src/data/elements';
import PeriodicTable from './src/components/PeriodicTable';
import StudyScreen from './src/screens/StudyScreen';
import QuizScreen from './src/screens/QuizScreen';
import AtomBuilder from './src/screens/AtomBuilder';
import { COLORS, SHADOWS, RADIUS, getCategoryColor } from './src/theme';
import { saveXP, loadXP, saveLevels, loadLevels, saveStudyPool, loadStudyPool } from './src/data/storage';

type Tab = 'home' | 'table' | 'study' | 'builder' | 'quiz';

function StudyIcon({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

function BuilderIcon({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </Svg>
  );
}

function QuizIcon({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

function TableIcon({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </Svg>
  );
}

function TabIcon({ name, color }: { name: Tab; color: string }) {
  if (name === 'home') {
    return (
      <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <Polyline points="9 22 9 12 15 12 15 22" />
      </Svg>
    );
  }
  if (name === 'study') return <StudyIcon color={color} />;
  if (name === 'builder') return <BuilderIcon color={color} />;
  if (name === 'quiz') return <QuizIcon color={color} />;
  return <TableIcon color={color} />;
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'table', label: 'Table' },
  { key: 'study', label: 'Study' },
  { key: 'builder', label: 'Builder' },
  { key: 'quiz', label: 'Quiz' },
];

const INITIAL_POOL = [1, 2, 3, 4, 5, 6];

function getLeague(xp: number) {
  if (xp >= 5000) return { name: 'Nobel Laureate', color: '#FBBF24' };
  if (xp >= 1500) return { name: 'Professor', color: '#ec4899' };
  if (xp >= 500) return { name: 'Researcher', color: '#a855f7' };
  if (xp >= 100) return { name: 'Scholar', color: '#3b82f6' };
  return { name: 'Apprentice', color: '#64748b' };
}

function maybeExpandPool(levels: Record<number, number>, currentPool: number[]): number[] {
  const allMastered = currentPool.every(z => (levels[z] || 0) >= 2);
  if (!allMastered) return currentPool;
  const inPool = new Set(currentPool);
  const candidates: number[] = [];
  for (let z = 1; z <= 118; z++) {
    if (!inPool.has(z) && (levels[z] || 0) === 0) candidates.push(z);
  }
  if (candidates.length === 0) return currentPool;
  const addCount = Math.min(4, candidates.length);
  return [...currentPool, ...candidates.sort(() => Math.random() - 0.5).slice(0, addCount)];
}

function pickFromPool(pool: number[], levels: Record<number, number>): number {
  const low = pool.filter(z => (levels[z] || 0) < 2);
  const high = pool.filter(z => (levels[z] || 0) >= 2);
  const useReview = Math.random() < 0.25 && high.length > 0;
  const candidates = useReview ? high : (low.length > 0 ? low : high);
  const weights = candidates.map(z => ({ z, w: 10 - Math.min((levels[z] || 0), 9) }));
  const total = weights.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  for (const { z, w } of weights) { r -= w; if (r <= 0) return z; }
  return candidates[0];
}

function xpForLevel(level: number): number { return 10 + level * 5; }

function HomeScreen({ xp, discovered, levels, studyPool, onGoStudy, onGoQuiz, onGoBuilder, onGoTable }: {
  xp: number; discovered: number[]; levels: Record<number, number>; studyPool: number[];
  onGoStudy: () => void; onGoQuiz: () => void; onGoBuilder: () => void; onGoTable: () => void;
}) {
  const league = getLeague(xp);
  const pct = Math.round((discovered.length / 118) * 100);
  const nextXP = xp < 100 ? 100 : xp < 500 ? 500 : xp < 1500 ? 1500 : xp < 5000 ? 5000 : 0;
  const nextPct = nextXP ? Math.round((xp / nextXP) * 100) : 100;
  const poolDone = studyPool.filter(z => (levels[z] || 0) >= 2).length;
  const poolPct = Math.round((poolDone / studyPool.length) * 100);
  const topEls = Object.entries(levels).filter(([_, l]) => l > 0).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <ScrollView style={HS.scroll} contentContainerStyle={HS.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['rgba(99, 102, 241, 0.08)', 'rgba(10, 14, 26, 0.2)']} style={HS.hero}>
        <View style={HS.headerTop}>
          <Text style={HS.title}>Periodic Lab</Text>
          <Text style={HS.subtitle}>Quantum Mechanics & Atom Synthesis</Text>
        </View>

        {/* Sleek Gamified Status Panel */}
        <View style={HS.profileCard}>
          <LinearGradient colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']} style={StyleSheet.absoluteFill} />
          <View style={HS.avatarGlow}>
            <LinearGradient colors={['#a855f7', '#6366f1']} style={HS.avatarCircle}>
              <Text style={HS.avatarText}>{league.name[0]}</Text>
            </LinearGradient>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <View style={HS.profileHeader}>
              <Text style={HS.leagueName}>{league.name.toUpperCase()}</Text>
              <Text style={HS.xpVal}>{xp} <Text style={HS.xpLabel}>XP</Text></Text>
            </View>
            {nextXP > 0 && (
              <View style={HS.leagueProg}>
                <View style={HS.leagueBar}>
                  <LinearGradient colors={['#a855f7', '#6366f1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[HS.leagueFill, { width: `${nextPct}%` }]} />
                </View>
                <View style={HS.leagueMetaRow}>
                  <Text style={HS.leagueMeta}>Next Tier at {nextXP} XP</Text>
                  <Text style={HS.leagueMeta}>{nextPct}%</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Main Actions Panel */}
      <Text style={HS.sectionLabel}>LABORATORY MODULES</Text>
      <View style={HS.actionRow}>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoStudy} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(99, 102, 241, 0.08)', 'rgba(99, 102, 241, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
            <StudyIcon color="#818cf8" />
          </View>
          <View style={HS.moduleTextContainer}>
            <Text style={HS.moduleLabel}>Study</Text>
            <Text style={HS.moduleDesc}>Analyze 3D structures</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoBuilder} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(168, 85, 247, 0.08)', 'rgba(168, 85, 247, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
            <BuilderIcon color="#a78bfa" />
          </View>
          <View style={HS.moduleTextContainer}>
            <Text style={HS.moduleLabel}>Builder</Text>
            <Text style={HS.moduleDesc}>Assemble atoms manually</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={HS.actionRow}>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoQuiz} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(244, 114, 182, 0.08)', 'rgba(244, 114, 182, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(244, 114, 182, 0.12)' }]}>
            <QuizIcon color="#f472b6" />
          </View>
          <View style={HS.moduleTextContainer}>
            <Text style={HS.moduleLabel}>Quiz</Text>
            <Text style={HS.moduleDesc}>Test your knowledge</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoTable} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(34, 211, 238, 0.08)', 'rgba(34, 211, 238, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(34, 211, 238, 0.12)' }]}>
            <TableIcon color="#22d3ee" />
          </View>
          <View style={HS.moduleTextContainer}>
            <Text style={HS.moduleLabel}>Table</Text>
            <Text style={HS.moduleDesc}>Explore element matrix</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Study Pool Details */}
      <View style={[HS.poolCard, HS.card]}>
        <Text style={HS.sectionLabelInside}>CURRENT STUDY POOL</Text>
        <View style={HS.poolHeader}>
          <View>
            <Text style={HS.poolStatus}>{poolDone} of {studyPool.length} Mastered ({poolPct}%)</Text>
            <Text style={HS.poolSub}>Achieve level 2+ in quizzes to master elements</Text>
          </View>
        </View>
        <View style={HS.poolBar}>
          <LinearGradient colors={['#6366f1', '#a855f7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[HS.poolFill, { width: `${poolPct}%` }]} />
        </View>
        <View style={HS.poolEls}>
          {studyPool.map(z => {
            const el = getElement(z);
            const lvl = levels[z] || 0;
            const elColor = getCategoryColor(el.category);
            return (
              <View key={z} style={[HS.poolElPill, { borderColor: lvl >= 2 ? elColor : 'rgba(255,255,255,0.06)' }]}>
                <View style={[HS.poolDot, { backgroundColor: lvl >= 2 ? elColor : '#475569' }]} />
                <Text style={[HS.poolSymText, { color: lvl >= 2 ? '#f8fafc' : '#94a3b8' }]}>{el.sym}</Text>
                <Text style={HS.poolLvlText}>L{lvl}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Top Elements List */}
      <View style={HS.sectionHead}><Text style={HS.sectionLabel}>TOP ELEMENTS</Text></View>
      <View style={HS.topGrid}>
        {topEls.length > 0 ? topEls.map(([zStr, lvl]) => {
          const z = parseInt(zStr); const el = getElement(z); const cc = getCategoryColor(el.category);
          return (
            <View key={z} style={[HS.topItem, HS.card]}>
              <Text style={[HS.topSym, { color: cc }]}>{el.sym}</Text>
              <Text style={HS.topName}>{el.nameEn}</Text>
              <View style={[HS.topLvl, { backgroundColor: cc + '15' }]}>
                <Text style={[HS.topLvlTxt, { color: cc }]}>Lv.{lvl}</Text>
              </View>
            </View>
          );
        }) : <Text style={HS.empty}>Play quizzes or build atoms to level up elements!</Text>}
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [elementLevels, setElementLevels] = useState<Record<number, number>>({});
  const [totalXP, setTotalXP] = useState(0);
  const [studyPool, setStudyPool] = useState<number[]>(INITIAL_POOL);
  const [studyZ, setStudyZ] = useState(6);
  const [quizZ, setQuizZ] = useState(() => pickFromPool(INITIAL_POOL, {}));

  // Initial loading from Storage
  useEffect(() => {
    async function loadSavedData() {
      const savedXP = await loadXP();
      const savedLevels = await loadLevels();
      const savedPool = await loadStudyPool(INITIAL_POOL);
      
      setTotalXP(savedXP);
      setElementLevels(savedLevels);
      setStudyPool(savedPool);
      
      // Select appropriate quiz element based on loaded pool/levels
      setQuizZ(pickFromPool(savedPool, savedLevels));
    }
    loadSavedData();
  }, []);

  const discovered = Object.entries(elementLevels).filter(([_, l]) => l > 0).map(([z]) => parseInt(z));

  const handleCorrect = useCallback((z: number) => {
    const currentLevel = elementLevels[z] || 0;
    const gained = xpForLevel(currentLevel);
    const newLevels = { ...elementLevels, [z]: currentLevel + 1 };
    
    setElementLevels(newLevels);
    saveLevels(newLevels);

    setTotalXP(prev => {
      const nx = prev + gained;
      saveXP(nx);
      return nx;
    });

    const expanded = maybeExpandPool(newLevels, studyPool);
    if (expanded.length !== studyPool.length) {
      setStudyPool(expanded);
      saveStudyPool(expanded);
      setQuizZ(pickFromPool(expanded, newLevels));
    } else {
      setQuizZ(pickFromPool(studyPool, newLevels));
    }
  }, [elementLevels, studyPool]);

  const handleNextQuiz = useCallback(() => {
    setQuizZ(pickFromPool(studyPool, elementLevels));
  }, [studyPool, elementLevels]);

  const handleDiscover = useCallback((z: number) => {
    const currentLevel = elementLevels[z] || 0;
    if (currentLevel === 0) {
      const newLevels = { ...elementLevels, [z]: 1 };
      setElementLevels(newLevels);
      saveLevels(newLevels);

      setTotalXP(prev => {
        const nx = prev + 50; // Discovery XP bonus!
        saveXP(nx);
        return nx;
      });

      if (!studyPool.includes(z)) {
        const newPool = [...studyPool, z];
        setStudyPool(newPool);
        saveStudyPool(newPool);
      }
    }
  }, [elementLevels, studyPool]);

  const handleSelectTableElement = useCallback((z: number) => {
    setStudyZ(z);
    setTab('study');
  }, []);

  const screen = {
    home: <HomeScreen xp={totalXP} discovered={discovered} levels={elementLevels} studyPool={studyPool}
      onGoStudy={() => setTab('study')} onGoQuiz={() => setTab('quiz')} onGoBuilder={() => setTab('builder')} onGoTable={() => setTab('table')} />,
    study: <StudyScreen z={studyZ} onChange={setStudyZ} xp={totalXP} levels={elementLevels} discovered={discovered} onGoBuilder={(z) => { setStudyZ(z); setTab('builder'); }} />,
    builder: <AtomBuilder z={studyZ} found={discovered} onDiscover={handleDiscover} xp={totalXP} levels={elementLevels} />,
    quiz: <QuizScreen z={quizZ} elementLevels={elementLevels} discovered={discovered}
      pool={studyPool} onCorrect={handleCorrect} onNext={handleNextQuiz} />,
    table: <PeriodicTable discovered={discovered} levels={elementLevels} xp={totalXP} onSelect={handleSelectTableElement} onGoBuilder={(z) => { setStudyZ(z); setTab('builder'); }} />,
  }[tab];

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={S.content}>{screen}</View>
      
      {/* Floating Glassmorphic Navigation Bar */}
      <View style={S.bar}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <TouchableOpacity key={t.key} style={S.tab} onPress={() => setTab(t.key)} activeOpacity={0.75}>
              <View style={[S.tabInner, active && S.tabInnerActive]}>
                <TabIcon name={t.key} color={active ? COLORS.tabActive : COLORS.tabInactive} />
                {active ? (
                  <Text style={S.tabLabelActive}>{t.label}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1 },
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 14, 26, 0.92)',
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tabInnerActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  tabIcon: {
    fontSize: 20,
    color: COLORS.tabInactive,
    textAlign: 'center',
  },
  tabIconActive: {
    color: COLORS.tabActive,
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.tabActive,
    marginLeft: 6,
  },
});

const HS = StyleSheet.create({
  scroll: { flex: 1 },
  container: { paddingBottom: 160 },
  hero: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 22 },
  headerTop: { marginBottom: 18 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text, letterSpacing: -0.6 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, letterSpacing: 0.2, marginTop: 3 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  avatarGlow: {
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leagueName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 0.8,
  },
  xpVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  xpLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'normal',
  },
  leagueProg: {
    marginTop: 2,
  },
  leagueBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  leagueFill: {
    height: '100%',
    borderRadius: 3,
  },
  leagueMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  leagueMeta: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },

  card: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },

  actionRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  moduleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    backgroundColor: 'rgba(17, 24, 45, 0.45)',
    overflow: 'hidden',
    minHeight: 72,
    ...SHADOWS.card,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  moduleTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  moduleLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  moduleDesc: {
    fontSize: 9.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  poolCard: { marginHorizontal: 16, padding: 18, marginBottom: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1.0, marginHorizontal: 20, marginBottom: 10, marginTop: 8 },
  sectionLabelInside: { fontSize: 10, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1.0, marginBottom: 12 },
  poolHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  poolStatus: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  poolSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  poolBar: { height: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2.5, overflow: 'hidden', marginBottom: 14 },
  poolFill: { height: '100%', borderRadius: 2.5 },
  poolEls: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  poolElPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    gap: 6,
  },
  poolDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  poolSymText: {
    fontSize: 13,
    fontWeight: '700',
  },
  poolLvlText: {
    fontSize: 9,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },

  sectionHead: { paddingHorizontal: 20, marginBottom: 8 },
  topGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  topItem: { width: '23%', padding: 12, alignItems: 'center' },
  topSym: { fontSize: 20, fontWeight: '800', marginBottom: 3 },
  topName: { fontSize: 9, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 4 },
  topLvl: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  topLvlTxt: { fontSize: 8, fontWeight: '800' },
  empty: { color: COLORS.textTertiary, fontSize: 12, textAlign: 'center', width: '100%', padding: 24 },
});

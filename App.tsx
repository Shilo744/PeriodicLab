import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Line, Rect, Polyline } from 'react-native-svg';

import { getElement } from './src/data/elements';
import PeriodicTable from './src/components/PeriodicTable';
import StudyScreen from './src/screens/StudyScreen';
import QuizScreen from './src/screens/QuizScreen';
import AtomBuilder from './src/screens/AtomBuilder';
import { COLORS, SHADOWS, RADIUS, getCategoryColor } from './src/theme';
import { 
  saveXP, loadXP, 
  saveLevels, loadLevels, 
  saveStudyPool, loadStudyPool,
  saveAchievements, loadAchievements,
  updateDailyStreak, loadPreferences, savePreferences, loadLastTab, saveLastTab, loadLastElement, saveLastElement,
  loadDailyQuestCompletion, saveDailyQuestCompletion
  , loadOnboardingComplete, saveOnboardingComplete
  , loadWeeklyGoal, saveWeeklyGoal
} from './src/data/storage';
import { 
  ACHIEVEMENTS_LIST, CHAPTERS, 
  checkAchievements, getDailyFeaturedElement 
} from './src/data/achievements';
import { Locale, t } from './src/data/i18n';
import { triggerHaptic, playSound, isAudioMuted, setAudioMuted, toggleAudioMuted } from './src/services/feedback';
import FlashcardScreen from './src/screens/FlashcardScreen';
import ReactionLabScreen from './src/screens/ReactionLabScreen';
import { validateScientificData } from './src/data/validation';
import { shuffled } from './src/utils/random';
import OnboardingScreen from './src/components/OnboardingScreen';
import { WeeklyGoal, WEEKLY_GOAL_REWARD, WEEKLY_GOAL_TARGET, normalizeWeeklyGoal, recordWeeklyAction } from './src/data/weeklyGoal';

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

const TABS: { key: Tab; labelKey: any }[] = [
  { key: 'home', labelKey: 'appTitle' },
  { key: 'table', labelKey: 'table' },
  { key: 'study', labelKey: 'study' },
  { key: 'builder', labelKey: 'builder' },
  { key: 'quiz', labelKey: 'quiz' },
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
  return [...currentPool, ...shuffled(candidates).slice(0, addCount)];
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
  return candidates[0] || 1;
}

function xpForLevel(level: number): number { return 10 + level * 5; }

import ProfileScreen from './src/screens/ProfileScreen';

function HomeScreen({ 
  xp, discovered, levels, studyPool, unlockedAchievements, dailyStreak, dailyQuestCompleted, weeklyGoal, locale, onToggleLocale,
  onGoStudy, onGoQuiz, onGoBuilder, onGoTable, onGoFlashcards, onGoReactions, onSelectElement
}: {
  xp: number; discovered: number[]; levels: Record<number, number>; studyPool: number[];
  unlockedAchievements: string[]; dailyStreak: number; dailyQuestCompleted: boolean; weeklyGoal: WeeklyGoal; locale: Locale; onToggleLocale: () => void;
  onGoStudy: () => void; onGoQuiz: () => void; onGoBuilder: () => void; onGoTable: () => void;
  onGoFlashcards: () => void;
  onGoReactions: () => void;
  onSelectElement: (z: number) => void;
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [mutedState, setMutedState] = useState(isAudioMuted());
  const league = getLeague(xp);
  const nextXP = xp < 100 ? 100 : xp < 500 ? 500 : xp < 1500 ? 1500 : xp < 5000 ? 5000 : 0;
  const nextPct = nextXP ? Math.round((xp / nextXP) * 100) : 100;
  const poolDone = studyPool.filter(z => (levels[z] || 0) >= 2).length;
  const poolPct = Math.round((poolDone / Math.max(1, studyPool.length)) * 100);
  const daily = getDailyFeaturedElement();
  const dailyEl = getElement(daily.z);

  if (showProfile) {
    return (
      <ProfileScreen
        xp={xp}
        discovered={discovered}
        levels={levels}
        dailyStreak={dailyStreak}
        unlockedAchievementsCount={unlockedAchievements.length}
        locale={locale}
        onClose={() => setShowProfile(false)}
      />
    );
  }

  return (
    <ScrollView style={HS.scroll} contentContainerStyle={HS.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['rgba(99, 102, 241, 0.08)', 'rgba(10, 14, 26, 0.2)']} style={HS.hero}>
        <View style={HS.headerTop}>
          <View>
            <Text style={HS.title}>{t('appTitle', locale)}</Text>
            <Text style={HS.subtitle}>{t('appSubtitle', locale)}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <TouchableOpacity 
              style={HS.langToggle} 
              onPress={() => {
                const nowMuted = toggleAudioMuted();
                setMutedState(nowMuted);
                savePreferences({ audioMuted: nowMuted });
              }} 
              activeOpacity={0.75}
            >
              <Text style={HS.langToggleTxt}>{mutedState ? '🔇' : '🔊'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={HS.langToggle} onPress={onToggleLocale} activeOpacity={0.75}>
              <Text style={HS.langToggleTxt}>{locale === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Panel */}
        <TouchableOpacity style={HS.profileCard} onPress={() => setShowProfile(true)} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']} style={StyleSheet.absoluteFill} />
          <View style={HS.avatarGlow}>
            <LinearGradient colors={['#a855f7', '#6366f1']} style={HS.avatarCircle}>
              <Text style={HS.avatarText}>{league.name[0]}</Text>
            </LinearGradient>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <View style={HS.profileHeader}>
              <Text style={HS.leagueName}>{league.name.toUpperCase()} (STATS ➔)</Text>
              <View style={HS.streakPill}>
                <Text style={HS.streakText}>🔥 {dailyStreak}d Streak</Text>
              </View>
            </View>
            <Text style={HS.xpVal}>{xp} <Text style={HS.xpLabel}>XP</Text></Text>
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
        </TouchableOpacity>
      </LinearGradient>

      {/* Daily Quest Banner */}
      <View style={HS.dailyCard}>
        <LinearGradient colors={['rgba(251, 191, 36, 0.12)', 'rgba(10, 14, 26, 0.4)']} style={StyleSheet.absoluteFill} />
        <View style={HS.dailyContent}>
          <View style={HS.dailyLeft}>
            <Text style={HS.dailyTag}>{t('dailyQuest', locale)}</Text>
            <Text style={HS.dailyTitle}>{locale === 'he' ? `חקרו את ${dailyEl.nameEn} (${dailyEl.sym})` : `Explore ${dailyEl.nameEn} (${dailyEl.sym})`}</Text>
            <Text style={HS.dailySub}>{dailyQuestCompleted ? (locale === 'he' ? 'הושלם — חזרו מחר למשימה חדשה!' : 'Completed — come back tomorrow!') : (locale === 'he' ? `למדו את הסיפור שלו וקבלו היום ${daily.bonusXP}+ XP` : `Learn its story and earn +${daily.bonusXP} XP today!`)}</Text>
          </View>
          <View style={HS.dailyActions}>
            <TouchableOpacity style={HS.dailyBtn} onPress={() => onSelectElement(daily.z)} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={`Explore today's element, ${dailyEl.nameEn}`}>
              <Text style={HS.dailyBtnTxt}>{dailyQuestCompleted ? (locale === 'he' ? 'שוב' : 'Review') : (locale === 'he' ? 'קבלו' : 'Claim')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={HS.dailyShareBtn} onPress={() => void Share.share({ message: locale === 'he' ? `יסוד היום שלי במעבדה המחזורית הוא ${dailyEl.nameEn} (${dailyEl.sym}), מספר אטומי ${dailyEl.z}. תוכלו לשלוט בו גם?` : `Today's Periodic Lab element is ${dailyEl.nameEn} (${dailyEl.sym}), atomic number ${dailyEl.z}. Can you master it too?` })} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={locale === 'he' ? 'שיתוף יסוד היום' : "Share today's element"}>
              <Text style={HS.dailyShareTxt}>{locale === 'he' ? 'שיתוף' : 'Share'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={HS.weeklyCard} accessible accessibilityLabel={`Weekly research goal: ${weeklyGoal.actions} of ${WEEKLY_GOAL_TARGET} learning actions complete`}>
        <View style={HS.weeklyHeader}>
          <View>
            <Text style={HS.weeklyTag}>{locale === 'he' ? 'יעד מחקר שבועי' : 'WEEKLY RESEARCH GOAL'}</Text>
            <Text style={HS.weeklyTitle}>{weeklyGoal.rewarded ? (locale === 'he' ? 'המשימה הושלמה!' : 'Mission complete!') : (locale === 'he' ? `עוד ${WEEKLY_GOAL_TARGET - weeklyGoal.actions} פעולות לקבלת הפרס` : `${WEEKLY_GOAL_TARGET - weeklyGoal.actions} actions to your reward`)}</Text>
          </View>
          <Text style={HS.weeklyReward}>{weeklyGoal.rewarded ? '✓' : `+${WEEKLY_GOAL_REWARD} XP`}</Text>
        </View>
        <View style={HS.weeklyTrack}><LinearGradient colors={['#34d399', '#22d3ee']} style={[HS.weeklyFill, { width: `${Math.round((weeklyGoal.actions / WEEKLY_GOAL_TARGET) * 100)}%` }]} /></View>
        <Text style={HS.weeklyMeta}>{weeklyGoal.actions}/{WEEKLY_GOAL_TARGET} · {locale === 'he' ? 'תשובות בחידון, תגליות והמשימה היומית נחשבות' : 'Quiz answers, discoveries and the daily quest count'}</Text>
      </View>

      {/* Main Actions Panel */}
      <Text style={HS.sectionLabel}>{t('modules', locale)}</Text>
      <View style={HS.actionRow}>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoStudy} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(99, 102, 241, 0.08)', 'rgba(99, 102, 241, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
            <StudyIcon color="#818cf8" />
          </View>
          <View style={HS.moduleTextContainer}>
            <Text style={HS.moduleLabel}>{t('study', locale)}</Text>
            <Text style={HS.moduleDesc}>{t('studyDesc', locale)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoBuilder} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(168, 85, 247, 0.08)', 'rgba(168, 85, 247, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
            <BuilderIcon color="#a78bfa" />
          </View>
          <View style={HS.moduleTextContainer}>
            <Text style={HS.moduleLabel}>{t('builder', locale)}</Text>
            <Text style={HS.moduleDesc}>{t('builderDesc', locale)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoReactions} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(251, 146, 60, 0.10)', 'rgba(251, 146, 60, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(251, 146, 60, 0.12)' }]}><Text style={{ fontSize: 18 }}>⚗️</Text></View>
          <View style={HS.moduleTextContainer}><Text style={HS.moduleLabel}>Reaction Lab</Text><Text style={HS.moduleDesc}>Run and inspect balanced equations</Text></View>
        </TouchableOpacity>
      </View>

      <View style={HS.actionRow}>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoFlashcards} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(52, 211, 153, 0.10)', 'rgba(52, 211, 153, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(52, 211, 153, 0.12)' }]}>
            <Text style={{ fontSize: 18 }}>🧠</Text>
          </View>
          <View style={HS.moduleTextContainer}>
            <Text style={HS.moduleLabel}>Flashcards</Text>
            <Text style={HS.moduleDesc}>Recall element facts and track mastery</Text>
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
            <Text style={HS.moduleLabel}>{t('quiz', locale)}</Text>
            <Text style={HS.moduleDesc}>{t('quizDesc', locale)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={HS.moduleCard} onPress={onGoTable} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(34, 211, 238, 0.08)', 'rgba(34, 211, 238, 0.01)']} style={StyleSheet.absoluteFill} />
          <View style={[HS.iconWrapper, { backgroundColor: 'rgba(34, 211, 238, 0.12)' }]}>
            <TableIcon color="#22d3ee" />
          </View>
          <View style={HS.moduleTextContainer}>
            <Text style={HS.moduleLabel}>{t('table', locale)}</Text>
            <Text style={HS.moduleDesc}>{t('tableDesc', locale)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Chapters & Mastery Progression */}
      <Text style={HS.sectionLabel}>{t('chapters', locale)}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={HS.chapterScroll}>
        {CHAPTERS.map(ch => {
          const chDiscovered = ch.elements.filter(z => discovered.includes(z)).length;
          const chPct = Math.round((chDiscovered / ch.elements.length) * 100);
          const isUnlocked = xp >= ch.requiredXP;

          return (
            <View key={ch.id} style={[HS.chapterCard, !isUnlocked && HS.chapterCardLocked]}>
              <Text style={HS.chapterNum}>{ch.title.toUpperCase()}</Text>
              <Text style={HS.chapterSubtitle}>{ch.subtitle}</Text>
              <View style={HS.chapterBar}>
                <LinearGradient 
                  colors={isUnlocked ? ['#6366f1', '#a855f7'] : ['#475569', '#334155']} 
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[HS.chapterFill, { width: `${chPct}%` }]} 
                />
              </View>
              <Text style={HS.chapterMeta}>
                {isUnlocked ? `${chDiscovered}/${ch.elements.length} ${t('discovered', locale)} (${chPct}%)` : `Requires ${ch.requiredXP} XP`}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Achievements Showcase */}
      <Text style={HS.sectionLabel}>{t('achievements', locale)} ({unlockedAchievements.length}/{ACHIEVEMENTS_LIST.length})</Text>
      <View style={HS.achievementsGrid}>
        {ACHIEVEMENTS_LIST.map(ach => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          return (
            <View key={ach.id} style={[HS.achCard, isUnlocked && HS.achCardUnlocked]}>
              <Text style={HS.achIcon}>{ach.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[HS.achTitle, isUnlocked && { color: '#fbbf24' }]}>{ach.title}</Text>
                <Text style={HS.achDesc}>{ach.description}</Text>
              </View>
              <View style={[HS.achBadge, isUnlocked ? HS.achBadgeDone : HS.achBadgeLock]}>
                <Text style={[HS.achBadgeTxt, isUnlocked ? { color: '#34d399' } : { color: COLORS.textTertiary }]}>
                  {isUnlocked ? '✓' : `+${ach.xpReward} XP`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [locale, setLocale] = useState<Locale>('en');
  const [elementLevels, setElementLevels] = useState<Record<number, number>>({});
  const [totalXP, setTotalXP] = useState(0);
  const [studyPool, setStudyPool] = useState<number[]>(INITIAL_POOL);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [dailyStreak, setDailyStreak] = useState(1);
  const [dailyQuestDate, setDailyQuestDate] = useState('');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal>(() => normalizeWeeklyGoal(null));
  const [studyZ, setStudyZ] = useState(6);
  const [quizZ, setQuizZ] = useState(() => pickFromPool(INITIAL_POOL, {}));
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    if (__DEV__) {
      const result = validateScientificData();
      if (!result.valid) console.warn('Scientific data validation issues:', result.errors);
    }
  }, []);

  const toggleLocale = useCallback(() => {
    triggerHaptic('light');
    playSound('click');
    const next = locale === 'en' ? 'he' : 'en';
    setLocale(next);
    void savePreferences({ locale: next });
  }, [locale]);

  // Initial loading from Storage
  useEffect(() => {
    let active = true;
    setLoadError(false);
    async function loadSavedData() {
      const [savedXP, savedLevels, savedPool, savedAch, savedDaily, preferences, savedTab, savedElement, savedDailyQuest, savedOnboarding, savedWeeklyGoal] = await Promise.all([
        loadXP(), loadLevels(), loadStudyPool(INITIAL_POOL), loadAchievements(),
        updateDailyStreak(), loadPreferences(), loadLastTab(), loadLastElement(), loadDailyQuestCompletion(), loadOnboardingComplete(), loadWeeklyGoal(),
      ]);
      if (!active) return;
      
      setTotalXP(savedXP);
      setElementLevels(savedLevels);
      setStudyPool(savedPool);
      setUnlockedAchievements(savedAch);
      setDailyStreak(savedDaily.streak);
      setDailyQuestDate(savedDailyQuest);
      // Do not interrupt returning users who installed before onboarding existed.
      setOnboardingComplete(savedOnboarding || savedXP > 0 || Object.keys(savedLevels).length > 0);
      setWeeklyGoal(savedWeeklyGoal);
      setLocale(preferences.locale);
      setAudioMuted(preferences.audioMuted);
      if (TABS.some(item => item.key === savedTab)) setTab(savedTab as Tab);
      setStudyZ(savedElement);
      setStorageReady(true);
      
      setQuizZ(pickFromPool(savedPool, savedLevels));
    }
    loadSavedData().catch(error => { if (active) { console.warn('Could not restore progress:', error); setLoadError(true); } });
    return () => { active = false; };
  }, [loadAttempt]);

  useEffect(() => { if (storageReady) saveLastTab(tab); }, [tab, storageReady]);
  useEffect(() => { if (storageReady) saveLastElement(studyZ); }, [studyZ, storageReady]);

  const discovered = Object.entries(elementLevels).filter(([_, l]) => l > 0).map(([z]) => parseInt(z));

  // Check achievements whenever discovered or totalXP updates
  useEffect(() => {
    if (!storageReady || (discovered.length === 0 && totalXP === 0)) return;
    const { newUnlocked, totalBonusXP } = checkAchievements(discovered, totalXP, unlockedAchievements);
    if (newUnlocked.length > 0) {
      const updated = [...unlockedAchievements, ...newUnlocked];
      setUnlockedAchievements(updated);
      saveAchievements(updated);
      if (totalBonusXP > 0) {
        setTotalXP(prev => {
          const nx = prev + totalBonusXP;
          saveXP(nx);
          return nx;
        });
      }
    }
  }, [discovered.length, totalXP, unlockedAchievements, storageReady]);

  const recordLearningAction = useCallback(() => {
    setWeeklyGoal(previous => {
      const next = recordWeeklyAction(previous);
      void saveWeeklyGoal(next);
      if (!previous.rewarded && next.rewarded) {
        setTotalXP(currentXP => {
          const rewardedXP = currentXP + WEEKLY_GOAL_REWARD;
          void saveXP(rewardedXP);
          return rewardedXP;
        });
      }
      return next;
    });
  }, []);

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
    recordLearningAction();
  }, [elementLevels, studyPool, recordLearningAction]);

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
      recordLearningAction();
    }
  }, [elementLevels, studyPool, recordLearningAction]);

  const handleSelectTableElement = useCallback((z: number) => {
    setStudyZ(z);
    setTab('study');
  }, []);

  const handleDailyQuest = useCallback((z: number) => {
    const daily = getDailyFeaturedElement();
    if (dailyQuestDate !== daily.dateStr) {
      setDailyQuestDate(daily.dateStr);
      void saveDailyQuestCompletion(daily.dateStr);
      setTotalXP(previous => {
        const next = previous + daily.bonusXP;
        void saveXP(next);
        return next;
      });
      recordLearningAction();
    }
    setStudyZ(z);
    setTab('study');
  }, [dailyQuestDate, recordLearningAction]);

  if (!storageReady) {
    return <View style={[S.root, { justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 }]}>
      {!loadError && <ActivityIndicator color={COLORS.primaryLight} size="large" />}
      <Text style={{ color: COLORS.text }}>{loadError ? 'Progress could not be loaded. No progress has been reset.' : 'Restoring your laboratory…'}</Text>
      {loadError && <TouchableOpacity accessibilityRole="button" onPress={() => setLoadAttempt(value => value + 1)} style={{ padding: 16 }}><Text style={{ color: COLORS.primaryLight }}>Retry</Text></TouchableOpacity>}
    </View>;
  }

  if (!onboardingComplete) {
    return <OnboardingScreen locale={locale} onLocaleChange={next => { setLocale(next); void savePreferences({ locale: next }); }} onComplete={() => { setOnboardingComplete(true); void saveOnboardingComplete(); }} />;
  }

  const screen = {
    home: (
      <HomeScreen 
        xp={totalXP} 
        discovered={discovered} 
        levels={elementLevels} 
        studyPool={studyPool}
        unlockedAchievements={unlockedAchievements}
        dailyStreak={dailyStreak}
        dailyQuestCompleted={dailyQuestDate === getDailyFeaturedElement().dateStr}
        weeklyGoal={weeklyGoal}
        locale={locale}
        onToggleLocale={toggleLocale}
        onGoStudy={() => setTab('study')} 
        onGoQuiz={() => setTab('quiz')} 
        onGoBuilder={() => setTab('builder')} 
        onGoTable={() => setTab('table')} 
        onGoFlashcards={() => setShowFlashcards(true)}
        onGoReactions={() => setShowReactions(true)}
        onSelectElement={handleDailyQuest}
      />
    ),
    study: <StudyScreen z={studyZ} onChange={setStudyZ} xp={totalXP} levels={elementLevels} discovered={discovered} onGoBuilder={(z) => { setStudyZ(z); setTab('builder'); }} />,
    builder: <AtomBuilder z={studyZ} found={discovered} onDiscover={handleDiscover} xp={totalXP} levels={elementLevels} />,
    quiz: <QuizScreen z={quizZ} elementLevels={elementLevels} discovered={discovered} pool={studyPool} onCorrect={handleCorrect} onNext={handleNextQuiz} />,
    table: <PeriodicTable discovered={discovered} levels={elementLevels} xp={totalXP} onSelect={handleSelectTableElement} onGoBuilder={(z) => { setStudyZ(z); setTab('builder'); }} />,
  }[tab];

  if (showFlashcards) {
    return <FlashcardScreen onClose={() => setShowFlashcards(false)} />;
  }
  if (showReactions) {
    return <ReactionLabScreen onClose={() => setShowReactions(false)} />;
  }

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={S.content}>{screen}</View>
      
      {/* Floating Glassmorphic Navigation Bar */}
      <View style={S.bar}>
        {TABS.map(tTab => {
          const active = tab === tTab.key;
          return (
            <TouchableOpacity key={tTab.key} style={S.tab} onPress={() => setTab(tTab.key)} activeOpacity={0.75} accessibilityRole="tab" accessibilityLabel={`${t(tTab.labelKey, locale)} module`} accessibilityState={{ selected: active }}>
              <View style={[S.tabInner, active && S.tabInnerActive]}>
                <TabIcon name={tTab.key} color={active ? COLORS.tabActive : COLORS.tabInactive} />
                {active ? (
                  <Text style={S.tabLabelActive}>{t(tTab.labelKey, locale)}</Text>
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
  hero: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.text, letterSpacing: -0.6 },
  subtitle: { fontSize: 12, color: COLORS.textSecondary, letterSpacing: 0.2, marginTop: 2 },
  langToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  langToggleTxt: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.text,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.lg,
    padding: 14,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  leagueName: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#a78bfa',
    letterSpacing: 0.8,
  },
  streakPill: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  streakText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#fbbf24',
  },
  xpVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  xpLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: 'normal',
  },
  leagueProg: {
    marginTop: 4,
  },
  leagueBar: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  leagueFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  leagueMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  leagueMeta: {
    fontSize: 9.5,
    color: COLORS.textSecondary,
  },

  // Daily quest card
  dailyCard: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
    overflow: 'hidden',
    padding: 12,
  },
  dailyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyLeft: {
    flex: 1,
  },
  dailyTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fbbf24',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  dailyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  dailySub: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  dailyBtn: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    marginLeft: 10,
  },
  dailyActions: { gap: 8, alignItems: 'stretch' },
  dailyShareBtn: { borderWidth: 1, borderColor: 'rgba(251,191,36,0.45)', borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center' },
  dailyShareTxt: { color: '#fbbf24', fontSize: 11, fontWeight: '800' },
  dailyBtnTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0a0e1a',
  },
  weeklyCard: { marginHorizontal: 16, marginBottom: 16, padding: 14, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'rgba(52,211,153,0.25)', backgroundColor: 'rgba(52,211,153,0.06)' },
  weeklyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  weeklyTag: { color: '#34d399', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  weeklyTitle: { color: COLORS.text, fontSize: 13, fontWeight: '800', marginTop: 3 },
  weeklyReward: { color: '#34d399', fontSize: 12, fontWeight: '900' },
  weeklyTrack: { height: 7, borderRadius: 4, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.06)', marginTop: 12 },
  weeklyFill: { height: '100%', borderRadius: 4 },
  weeklyMeta: { color: COLORS.textSecondary, fontSize: 9.5, marginTop: 7 },

  sectionLabel: { fontSize: 9.5, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1.0, marginHorizontal: 20, marginBottom: 8, marginTop: 4 },

  actionRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 10 },
  moduleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    backgroundColor: 'rgba(17, 24, 45, 0.45)',
    overflow: 'hidden',
    minHeight: 64,
    ...SHADOWS.card,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  moduleTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  moduleLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  moduleDesc: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  // Chapters horizontal scroll
  chapterScroll: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  chapterCard: {
    width: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 12,
    marginRight: 10,
  },
  chapterCardLocked: {
    opacity: 0.6,
  },
  chapterNum: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 0.5,
  },
  chapterSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
    marginBottom: 8,
  },
  chapterBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  chapterFill: {
    height: '100%',
    borderRadius: 2,
  },
  chapterMeta: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },

  // Achievements
  achievementsGrid: {
    paddingHorizontal: 16,
    gap: 8,
  },
  achCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    gap: 10,
  },
  achCardUnlocked: {
    borderColor: 'rgba(251, 191, 36, 0.3)',
    backgroundColor: 'rgba(251, 191, 36, 0.03)',
  },
  achIcon: {
    fontSize: 22,
  },
  achTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  achDesc: {
    fontSize: 9.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  achBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  achBadgeDone: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
  },
  achBadgeLock: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  achBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
  },
});

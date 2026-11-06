import { DEFAULT as Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/theme';
import { Activity, COMFORT, DEFAULT_ACTIVITIES } from '@/libs/comfort';
import { COUPLE } from '@/libs/couple';
import { MOODS, MoodId, loadMoodEntries } from '@/libs/moods';
import {
  DATE_IDEAS,
  Gratitude,
  REACH_OUTS,
  Sent,
  addGratitude,
  loadGratitude,
  loadSent,
  sendReachOut,
} from '@/libs/together';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppHeader from '@/components/AppHeader';

const TILE_BG = [Colors.blush, Colors.lavender, Colors.peach, Colors.backgroundCard];
const randomIdea = (not = -1) => {
  let i = Math.floor(Math.random() * DATE_IDEAS.length);
  if (i === not) i = (i + 1) % DATE_IDEAS.length;
  return i;
};

function Breathing() {
  const scale = useRef(new Animated.Value(1)).current;
  const [inhale, setInhale] = useState(true);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.5, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    const t = setInterval(() => setInhale((v) => !v), 4000);
    return () => {
      loop.stop();
      clearInterval(t);
    };
  }, [scale]);

  return (
    <View style={styles.breathWrap}>
      <Animated.View style={[styles.breathCircle, { transform: [{ scale }] }]} />
      <Text style={styles.breathText}>{inhale ? 'Breathe in…' : 'Breathe out…'}</Text>
    </View>
  );
}

export default function ForUsScreen() {
  const [latest, setLatest] = useState<MoodId | null>(null);
  const [sent, setSent] = useState<Sent[]>([]);
  const [notes, setNotes] = useState<Gratitude[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [active, setActive] = useState<Activity | null>(null);
  const [idea, setIdea] = useState(() => randomIdea());
  const [challengeDone, setChallengeDone] = useState(false);
  const [draft, setDraft] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const entries = await loadMoodEntries();
        const last = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).pop();
        const fresh = last && Date.now() - new Date(last.createdAt).getTime() < 36 * 3600 * 1000;
        setLatest(fresh ? last!.mood : null);
        setSent(await loadSent());
        setNotes(await loadGratitude());
      })();
    }, [])
  );

  const onReach = async (id: (typeof REACH_OUTS)[number]) => {
    await sendReachOut(id.id);
    setSent(await loadSent());
    setBanner(`${id.emoji} ${id.label} sent to ${COUPLE.partner}`);
    setTimeout(() => setBanner(null), 2200);
  };

  const onAddNote = async () => {
    const text = draft.trim();
    if (!text) return;
    await addGratitude(text, COUPLE.me);
    setNotes(await loadGratitude());
    setDraft('');
  };

  const mood = MOODS.find((m) => m.id === latest) ?? null;
  const activities = latest ? COMFORT[latest] : DEFAULT_ACTIVITIES;
  const lastSent = sent[sent.length - 1];
  const lastSentInfo = lastSent
    ? `Last sent: ${REACH_OUTS.find((r) => r.id === lastSent.kind)?.label} · ${new Date(lastSent.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader brand />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Better, together.</Text>
        <Text style={styles.subtitle}>Small ways to say “I’m here.”</Text>

        {/* REACH OUT */}
        <Text style={styles.sectionTitle}>Reach out to {COUPLE.partner}</Text>
        <View style={styles.grid}>
          {REACH_OUTS.map((r, i) => (
            <Pressable
              key={r.id}
              onPress={() => onReach(r)}
              style={({ pressed }) => [
                styles.reachTile,
                { backgroundColor: TILE_BG[i] },
                i === 3 && { borderWidth: 1, borderColor: Colors.outline },
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={{ fontSize: 30 }}>{r.emoji}</Text>
              <Text style={styles.reachLabel}>{r.label}</Text>
            </Pressable>
          ))}
        </View>
        {banner ? (
          <Text style={styles.banner}>{banner}</Text>
        ) : lastSentInfo ? (
          <Text style={styles.tiny}>{lastSentInfo}</Text>
        ) : (
          <Text style={styles.tiny}>One tap is enough. {COUPLE.partner} will feel it.</Text>
        )}

        {/* GENTLE RESET */}
        <Text style={[styles.sectionTitle, { marginTop: 26 }]}>A gentle reset</Text>
        <Text style={styles.sectionSub}>
          {mood ? `Because you're feeling ${mood.label.toLowerCase()}` : 'Soft ideas for any kind of day'}
        </Text>
        <View style={{ gap: 10 }}>
          {activities.map((a) => (
            <Pressable key={a.id} onPress={() => setActive(a)} style={styles.activity}>
              <View style={styles.activityIcon}>
                <Text style={{ fontSize: 22 }}>{a.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{a.title}</Text>
                <Text style={styles.activitySub}>{a.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
            </Pressable>
          ))}
        </View>
        {!mood && <Text style={[styles.tiny, { marginTop: 8 }]}>Do a check-in on the Moods tab and these will match how you feel.</Text>}

        {/* TOGETHER */}
        <Text style={[styles.sectionTitle, { marginTop: 26, marginBottom: 12 }]}>Do something together</Text>

        <View style={[styles.card, { backgroundColor: Colors.lavender, borderColor: Colors.lavender }]}>
          <Text style={styles.cardLabelPurple}>DATE IDEA</Text>
          <Text style={styles.ideaText}>{DATE_IDEAS[idea]}</Text>
          <Pressable onPress={() => setIdea((i) => randomIdea(i))} style={styles.ghostBtn}>
            <Ionicons name="shuffle-outline" size={16} color={Colors.lavenderText} />
            <Text style={styles.ghostBtnText}>Surprise us</Text>
          </Pressable>
        </View>

        <Pressable style={styles.card} onPress={() => setChallengeDone((v) => !v)}>
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.cardLabel}>THIS WEEK’S CHALLENGE</Text>
              <Text style={styles.challengeText}>Tell each other one thing you admire, out loud.</Text>
            </View>
            <View style={[styles.checkbox, challengeDone && styles.checkboxOn]}>
              {challengeDone && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </View>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>GRATITUDE JAR</Text>
          <Text style={styles.sectionSub}>Add something you appreciate. Read them together on Sunday.</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Today I’m grateful for…"
              placeholderTextColor={Colors.textSecondary}
              onSubmitEditing={onAddNote}
              returnKeyType="done"
              maxLength={160}
            />
            <Pressable onPress={onAddNote} style={[styles.addBtn, !draft.trim() && { opacity: 0.4 }]}>
              <Ionicons name="add" size={22} color="#fff" />
            </Pressable>
          </View>
          {notes.slice(-3).reverse().map((n) => (
            <View key={n.id} style={styles.noteRow}>
              <Text style={{ fontSize: 14 }}>🌸</Text>
              <Text style={styles.noteText}>
                {n.text} <Text style={styles.tiny}>· {n.by}</Text>
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.soon]}>
          <Text style={{ fontSize: 22 }}>🧩</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.activityTitle}>Couple quiz</Text>
            <Text style={styles.activitySub}>How well do you know each other? Coming soon.</Text>
          </View>
        </View>
      </ScrollView>

      {/* ACTIVITY MODAL */}
      <Modal visible={!!active} transparent animationType="fade" onRequestClose={() => setActive(null)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            {active && (
              <>
                <Text style={{ fontSize: 40, textAlign: 'center' }}>{active.emoji}</Text>
                <Text style={styles.sheetTitle}>{active.title}</Text>
                {active.kind === 'breathe' ? (
                  <Breathing />
                ) : (
                  <Text style={styles.sheetText}>{active.text}</Text>
                )}
                <Pressable onPress={() => setActive(null)} style={styles.cta}>
                  <Text style={styles.ctaText}>{active.kind === 'breathe' ? 'I feel calmer' : 'Done'}</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  brand: { fontSize: 12, fontWeight: '800', letterSpacing: 1.6, color: Colors.brand, fontFamily: Fonts.extraBold },

  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: Colors.textPrimary, fontFamily: Fonts.extraBold },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 6, marginBottom: 20, fontFamily: Fonts.regular },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4, fontFamily: Fonts.extraBold },
  sectionSub: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12, fontFamily: Fonts.regular },
  tiny: { fontSize: 11, color: Colors.textSecondary, fontFamily: Fonts.regular },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginTop: 8 },
  reachTile: { width: '48.5%', borderRadius: 20, paddingVertical: 20, alignItems: 'center', gap: 8 },
  reachLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, fontFamily: Fonts.bold },
  banner: { marginTop: 12, fontSize: 13, fontWeight: '700', color: Colors.brand, fontFamily: Fonts.bold },

  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, fontFamily: Fonts.extraBold },
  activitySub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1, fontFamily: Fonts.regular },

  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  cardLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: Colors.brand, marginBottom: 6, fontFamily: Fonts.extraBold },
  cardLabelPurple: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: Colors.lavenderText, marginBottom: 6, fontFamily: Fonts.extraBold },
  ideaText: { fontSize: 17, lineHeight: 24, fontWeight: '700', color: Colors.textPrimary, fontFamily: Fonts.bold },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, alignSelf: 'flex-start' },
  ghostBtnText: { fontSize: 13, fontWeight: '700', color: Colors.lavenderText, fontFamily: Fonts.bold },
  challengeText: { fontSize: 15, lineHeight: 21, fontWeight: '600', color: Colors.textPrimary, fontFamily: Fonts.semiBold },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: Colors.brand },

  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.outline,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: Fonts.regular,
  },
  addBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  noteRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  noteText: { flex: 1, fontSize: 13, lineHeight: 19, color: Colors.textPrimary, fontFamily: Fonts.regular },
  soon: { flexDirection: 'row', alignItems: 'center', gap: 12, opacity: 0.75 },

  backdrop: { flex: 1, backgroundColor: 'rgba(70,52,66,0.45)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: Colors.background, borderRadius: 28, padding: 24 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginTop: 8, fontFamily: Fonts.extraBold },
  sheetText: { fontSize: 15, lineHeight: 23, color: Colors.textPrimary, textAlign: 'center', marginVertical: 18, fontFamily: Fonts.regular },
  cta: { backgroundColor: Colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: Fonts.bold },

  breathWrap: { height: 220, alignItems: 'center', justifyContent: 'center' },
  breathCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: Colors.lavender, borderWidth: 2, borderColor: Colors.lavenderText },
  breathText: { position: 'absolute', bottom: 8, fontSize: 15, fontWeight: '700', color: Colors.lavenderText, fontFamily: Fonts.bold },
});
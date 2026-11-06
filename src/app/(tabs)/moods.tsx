import { DEFAULT as Colors } from '@/constants/Colors';
import { MOODS, MoodId, TimeOfDay, saveMoodEntry } from '@/libs/moods';
import { periodImages } from '@/libs/period-images';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PARTNER = 'Lim'; // mock: replace with linked partner name
const TODS: { id: TimeOfDay; label: string }[] = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
];
const DEFAULT_TRIGGERS = ['Work', 'Sleep', 'Relationships', 'Health', 'Not sure'];
const MAX_NOTE = 2000;

function defaultTod(): TimeOfDay {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
}

export default function MoodsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<'choose' | 'journal'>('choose');
  const [tod, setTod] = useState<TimeOfDay>(defaultTod());
  const [moodId, setMoodId] = useState<MoodId | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [options, setOptions] = useState(DEFAULT_TRIGGERS);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [custom, setCustom] = useState('');
  const [share, setShare] = useState(false);
  const [saving, setSaving] = useState(false);

  const mood = MOODS.find((m) => m.id === moodId) ?? null;
  const now = new Date();
  const longDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
  const shortDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const toggleTrigger = (t: string) =>
    setTriggers((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const addCustom = () => {
    const t = custom.trim();
    if (t && !options.includes(t)) {
      setOptions((o) => [...o, t]);
      setTriggers((cur) => [...cur, t]);
    }
    setCustom('');
    setAdding(false);
  };

  const reset = () => {
    setStep('choose');
    setMoodId(null);
    setIntensity(5);
    setNote('');
    setTriggers([]);
    setShare(false);
    setTod(defaultTod());
  };

  const onSave = async () => {
    if (!mood || saving) return;
    setSaving(true);
    try {
      await saveMoodEntry({
        mood: mood.id,
        intensity,
        timeOfDay: tod,
        note: note.trim(),
        triggers,
        shareWithPartner: share,
      });
      Alert.alert('Saved 💗', 'Your check-in is saved privately.');
      reset();
    } catch {
      Alert.alert('Couldn’t save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const onBack = () => (step === 'journal' ? setStep('choose') : router.navigate('/'));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.headerSide}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {step === 'choose' ? 'DAILY CHECK-IN' : `${tod.toUpperCase()} · ${shortDate}`}
        </Text>
        <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>
          <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textPrimary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'choose' ? (
          <>
            <Text style={styles.title}>What’s here for you?</Text>
            <Text style={styles.subtitle}>
              There’s no right way to feel. Start with the mood that feels closest.
            </Text>

            <View style={styles.todRow}>
              {TODS.map((t) => {
                const on = tod === t.id;
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => setTod(t.id)}
                    style={[styles.todPill, on && styles.todPillOn]}
                  >
                    <Image source={periodImages[t.id]} style={styles.todIcon} resizeMode="contain" />
                    <Text style={[styles.todText, on && { color: '#fff', fontWeight: '700' }]}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.dateRow}>
              <Text style={styles.dateLeft}>{longDate}</Text>
              <Text style={styles.dateRight}>{time} · Your time</Text>
            </View>

            <View style={styles.grid}>
              {MOODS.map((m) => {
                const on = moodId === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setMoodId(m.id)}
                    style={[styles.moodCard, on && styles.moodCardOn]}
                  >
                    <Image source={m.image} style={styles.moodImage} resizeMode="contain" />
                    <Text style={[styles.moodLabel, on && { fontWeight: '700' }]}>
                      {m.label}
                      {on ? ' ✓' : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.hint}>
              <Text style={styles.hintText}>
                A few feelings at once? That’s okay. You can add more in your journal.
              </Text>
            </View>
          </>
        ) : (
          mood && (
            <>
              <Text style={styles.title}>Make room for your feelings.</Text>

              {/* chosen mood */}
              <View style={styles.chosen}>
                <Image source={mood.image} style={styles.chosenImage} resizeMode="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.chosenName}>{mood.label}</Text>
                  <Text style={styles.chosenTip}>{mood.tip}</Text>
                </View>
                <Pressable onPress={() => setStep('choose')} hitSlop={10}>
                  <Ionicons name="pencil-outline" size={18} color={Colors.lavenderText} />
                </Pressable>
              </View>

              {/* intensity */}
              <View style={styles.card}>
                <View style={styles.intensityTop}>
                  <Text style={styles.cardTitle}>How strong does it feel?</Text>
                  <Text style={styles.intensityValue}>{intensity} / 10</Text>
                </View>
                <View style={styles.segments}>
                  {Array.from({ length: 10 }, (_, i) => {
                    const n = i + 1;
                    const isCurrent = n === intensity;
                    return (
                      <Pressable key={n} onPress={() => setIntensity(n)} style={styles.segHit}>
                        <View
                          style={[
                            styles.seg,
                            n < intensity && { backgroundColor: '#CC7FA1' },
                            isCurrent && { backgroundColor: Colors.brand, height: 20 },
                          ]}
                        />
                      </Pressable>
                    );
                  })}
                </View>
                <View style={styles.intensityLabels}>
                  <Text style={styles.tinyCaps}>A LITTLE</Text>
                  <Text style={styles.tinyCaps}>A LOT</Text>
                </View>
              </View>

              {/* journal */}
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Want to put it into words?</Text>
                <Text style={styles.optional}>Optional</Text>
              </View>
              <View style={styles.noteBox}>
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  maxLength={MAX_NOTE}
                  placeholder="Write anything you like. It stays private."
                  placeholderTextColor={Colors.textSecondary}
                  textAlignVertical="top"
                />
                <Text style={styles.counter}>
                  {note.length} / {MAX_NOTE.toLocaleString('en-US')}
                </Text>
              </View>

              {/* triggers */}
              <Text style={[styles.sectionTitle, { marginTop: 22, marginBottom: 10 }]}>
                What might be on your mind?
              </Text>
              <View style={styles.chips}>
                {options.map((t) => {
                  const on = triggers.includes(t);
                  return (
                    <Pressable
                      key={t}
                      onPress={() => toggleTrigger(t)}
                      style={[styles.chip, on && styles.chipOn]}
                    >
                      <Text style={[styles.chipText, on && { color: '#fff', fontWeight: '700' }]}>{t}</Text>
                    </Pressable>
                  );
                })}
                {adding ? (
                  <TextInput
                    style={styles.chipInput}
                    value={custom}
                    onChangeText={setCustom}
                    onSubmitEditing={addCustom}
                    onBlur={addCustom}
                    placeholder="Type, then enter"
                    placeholderTextColor={Colors.textSecondary}
                    autoFocus
                    maxLength={24}
                    returnKeyType="done"
                  />
                ) : (
                  <Pressable onPress={() => setAdding(true)} style={styles.chip}>
                    <Text style={styles.chipText}>+ Add my own</Text>
                  </Pressable>
                )}
              </View>

              {/* privacy */}
              <View style={styles.privacy}>
                <View style={styles.privacyHead}>
                  <View style={styles.lockBubble}>
                    <Ionicons name="lock-closed-outline" size={16} color={Colors.brand} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.privacyTitle}>Just for you</Text>
                    <Text style={styles.privacySub}>Journal and triggers stay private.</Text>
                  </View>
                </View>
                <Pressable style={styles.checkRow} onPress={() => setShare((s) => !s)}>
                  <View style={[styles.checkbox, share && styles.checkboxOn]}>
                    {share && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.checkText}>
                    Share only {mood.label} · {intensity}/10 with {PARTNER}
                  </Text>
                </Pressable>
              </View>
            </>
          )
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        {step === 'choose' ? (
          <>
            <Pressable
              disabled={!mood}
              onPress={() => setStep('journal')}
              style={({ pressed }) => [styles.cta, !mood && { opacity: 0.45 }, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.ctaText}>{mood ? `Continue with ${mood.label}` : 'Choose a mood'}</Text>
            </Pressable>
            <View style={styles.footNote}>
              <Ionicons name="lock-closed-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.footNoteText}>Your check-in starts private. Always.</Text>
            </View>
          </>
        ) : (
          <>
            <Pressable
              disabled={saving}
              onPress={onSave}
              style={({ pressed }) => [styles.cta, (pressed || saving) && { opacity: 0.8 }]}
            >
              <Ionicons name="lock-closed-outline" size={16} color="#fff" />
              <Text style={styles.ctaText}>{saving ? 'Saving…' : 'Save privately'}</Text>
            </Pressable>
            <View style={styles.footNote}>
              <Ionicons name="lock-closed-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.footNoteText}>Sharing is optional. You’re in control.</Text>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  headerSide: { width: 40 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: Colors.textSecondary,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 14, lineHeight: 20, color: Colors.textSecondary, marginTop: 8, marginBottom: 18 },

  todRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  todPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  todPillOn: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  todIcon: { width: 16, height: 16 },
  todText: { fontSize: 12, color: Colors.textPrimary },

  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dateLeft: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: Colors.textSecondary },
  dateRight: { fontSize: 11, color: Colors.textSecondary },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  moodCard: {
    width: '48.5%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  moodCardOn: { backgroundColor: Colors.lavender, borderColor: Colors.lavenderText, borderWidth: 1.5 },
  moodImage: { width: 28, height: 28 },
  moodLabel: { fontSize: 12, color: Colors.textPrimary },

  hint: { backgroundColor: Colors.lavender, borderRadius: 16, padding: 16, marginTop: 20 },
  hintText: { fontSize: 13, lineHeight: 19, color: Colors.lavenderText },

  chosen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.lavender,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    marginBottom: 14,
  },
  chosenImage: { width: 36, height: 36 },
  chosenName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  chosenTip: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginBottom: 22,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  intensityTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  intensityValue: { fontSize: 18, fontWeight: '800', color: Colors.brand },
  segments: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  segHit: { flex: 1, height: 32, justifyContent: 'center' },
  seg: { height: 8, borderRadius: 4, backgroundColor: '#EFE6E3' },
  intensityLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  tinyCaps: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1, color: Colors.textSecondary },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  optional: { fontSize: 11, fontWeight: '700', color: Colors.brand },
  noteBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 14,
  },
  noteInput: { minHeight: 90, fontSize: 14, lineHeight: 21, color: Colors.textPrimary, padding: 0 },
  counter: { fontSize: 10, color: Colors.textSecondary, textAlign: 'right', marginTop: 6 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  chipOn: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  chipText: { fontSize: 12, color: Colors.textPrimary },
  chipInput: {
    minWidth: 120,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.brand,
    backgroundColor: Colors.backgroundCard,
    fontSize: 12,
    color: Colors.textPrimary,
  },

  privacy: { backgroundColor: Colors.blush, borderRadius: 20, padding: 16, marginTop: 22 },
  privacyHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lockBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  privacySub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: Colors.brand },
  checkText: { flex: 1, fontSize: 12, color: Colors.textPrimary },

  footer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, backgroundColor: Colors.background },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: 999,
    paddingVertical: 16,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 6, marginTop: 10 },
  footNoteText: { fontSize: 11, color: Colors.textSecondary },
});
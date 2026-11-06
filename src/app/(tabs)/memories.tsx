import AppHeader from '@/components/AppHeader';
import { DEFAULT as Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/theme';
import { COUPLE } from '@/libs/couple';
import { MEMORIES, Memory } from '@/libs/memories';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Filter = 'all' | 'photos' | 'letters';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All keepsakes' },
  { id: 'photos', label: 'Photos' },
  { id: 'letters', label: 'Letters' },
];

const fmt = (iso: string, withYear = false) =>
  new Date(iso + 'T12:00:00')
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(withYear ? { year: 'numeric' as const } : {}),
    })
    .toUpperCase();

function Thumb({ m, height, radius }: { m: Memory; height: number; radius: number }) {
  return m.image ? (
    <Image source={m.image} style={{ width: '100%', height, borderRadius: radius }} resizeMode="cover" />
  ) : (
    <View style={[styles.thumb, { height, borderRadius: radius }]}>
      <Text style={{ fontSize: height > 150 ? 64 : 36 }}>{m.emoji}</Text>
    </View>
  );
}

export default function MemoriesScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [faves, setFaves] = useState<Record<string, boolean>>(
    Object.fromEntries(MEMORIES.map((m) => [m.id, !!m.favorite]))
  );

  const sorted = [...MEMORIES].sort((a, b) => b.date.localeCompare(a.date));
  const visible = sorted.filter((m) =>
    filter === 'all' ? true : filter === 'photos' ? m.type === 'photo' : m.type === 'letter'
  );
  const featured = filter === 'letters' ? null : visible.find((m) => m.type === 'photo') ?? null;
  const pages = visible.filter((m) => m.id !== featured?.id);
  const hasSurprise = MEMORIES.some((m) => m.type === 'letter' && m.from === COUPLE.partner);

  return (
    <View style={styles.container}>
      <AppHeader
        brand
        title='Just Ours'
        right={
          <Pressable hitSlop={10} onPress={() => {}}>
            <Ionicons name="add" size={26} color={Colors.textPrimary} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>The little things we keep.</Text>
        <Text style={styles.subtitle}>Our ordinary days. Our favorite kind of magic.</Text>

        {/* FILTERS */}
        <View style={styles.filters}>
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <Pressable key={f.id} onPress={() => setFilter(f.id)} style={[styles.pill, on && styles.pillOn]}>
                <Text style={[styles.pillText, on && { color: '#fff' }]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* SURPRISE */}
        {hasSurprise && (
          <Pressable style={styles.surprise} onPress={() => setFilter('letters')}>
            <Text style={{ fontSize: 34 }}>🎁</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.surpriseLabel}>A LITTLE SURPRISE</Text>
              <Text style={styles.surpriseTitle}>{COUPLE.partner} left something for you.</Text>
              <Text style={styles.surpriseLink}>Open whenever you’re ready →</Text>
            </View>
          </Pressable>
        )}

        {/* FEATURED */}
        {featured && (
          <View style={styles.featured}>
            <Thumb m={featured} height={210} radius={18} />
            <View style={styles.featuredBody}>
              <View style={styles.row}>
                <Text style={styles.date}>{fmt(featured.date, true)}</Text>
                <Pressable
                  hitSlop={10}
                  onPress={() => setFaves((f) => ({ ...f, [featured.id]: !f[featured.id] }))}
                >
                  <Ionicons
                    name={faves[featured.id] ? 'heart' : 'heart-outline'}
                    size={20}
                    color={Colors.brand}
                  />
                </Pressable>
              </View>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredText}>{featured.body}</Text>
              {(featured.place || featured.addedBy) && (
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
                  <Text style={styles.meta}>
                    {[featured.place, featured.addedBy && `Added by ${featured.addedBy}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* PAGES */}
        {pages.length > 0 && (
          <>
            <View style={[styles.row, { marginTop: 8, marginBottom: 12 }]}>
              <Text style={styles.sectionTitle}>Pages from our story</Text>
              <Pressable hitSlop={8} onPress={() => setFilter('all')}>
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            </View>
            <View style={styles.grid}>
              {pages.map((m) =>
                m.type === 'letter' ? (
                  <Pressable key={m.id} style={[styles.pageCard, styles.letterCard]} onPress={() => {}}>
                    <Text style={{ fontSize: 30 }}>{m.emoji}</Text>
                    <Text style={styles.letterDate}>{fmt(m.date)}</Text>
                    <Text style={styles.pageTitle}>{m.title}</Text>
                    <Text style={styles.pageText}>{m.body}</Text>
                    <Text style={styles.letterLink}>A letter from {m.from} →</Text>
                  </Pressable>
                ) : (
                  <Pressable key={m.id} style={[styles.pageCard, styles.photoCard]} onPress={() => {}}>
                    <Thumb m={m} height={96} radius={14} />
                    <Text style={[styles.date, { marginTop: 10 }]}>{fmt(m.date)}</Text>
                    <Text style={styles.pageTitle}>{m.title}</Text>
                    <Text style={styles.pageText}>{m.body}</Text>
                  </Pressable>
                )
              )}
            </View>
          </>
        )}

        {/* PRIVACY NOTE */}
        <View style={styles.privacy}>
          <Ionicons name="lock-closed-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.meta}>
            A private space for {COUPLE.me} & {COUPLE.partner}. No public feed.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  brand: { width: 90, fontSize: 12, fontWeight: '800', letterSpacing: 1.6, color: Colors.brand, fontFamily: Fonts.extraBold },
  headerCenter: { flex: 1, textAlign: 'center', fontSize: 11, letterSpacing: 1.4, color: Colors.textSecondary, fontFamily: Fonts.medium },
  headerRight: { width: 90, alignItems: 'flex-end' },

  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: Colors.textPrimary, fontFamily: Fonts.extraBold },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 6, marginBottom: 16, fontFamily: Fonts.regular },

  filters: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  pillOn: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  pillText: { fontSize: 12, color: Colors.textPrimary, fontFamily: Fonts.medium },

  surprise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.lavender,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  surpriseLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: Colors.lavenderText, fontFamily: Fonts.extraBold },
  surpriseTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginTop: 2, fontFamily: Fonts.extraBold },
  surpriseLink: { fontSize: 12, color: Colors.lavenderText, marginTop: 3, fontFamily: Fonts.medium },

  featured: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    padding: 10,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  featuredBody: { paddingHorizontal: 8, paddingTop: 14, paddingBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: Colors.textSecondary, fontFamily: Fonts.bold },
  featuredTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginTop: 8, fontFamily: Fonts.extraBold },
  featuredText: { fontSize: 13, lineHeight: 19, color: Colors.textSecondary, marginTop: 6, fontFamily: Fonts.regular },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  meta: { fontSize: 11, color: Colors.textSecondary, fontFamily: Fonts.regular },

  thumb: { width: '100%', backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, fontFamily: Fonts.extraBold },
  viewAll: { fontSize: 12, fontWeight: '700', color: Colors.brand, fontFamily: Fonts.bold },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  pageCard: { width: '48.5%', borderRadius: 20, padding: 12 },
  letterCard: { backgroundColor: Colors.blush, padding: 16 },
  photoCard: { backgroundColor: Colors.backgroundCard, borderWidth: 1, borderColor: Colors.outline },
  letterDate: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, color: Colors.brand, marginTop: 10, fontFamily: Fonts.bold },
  pageTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginTop: 6, fontFamily: Fonts.extraBold },
  pageText: { fontSize: 12, lineHeight: 17, color: Colors.textSecondary, marginTop: 4, fontFamily: Fonts.regular },
  letterLink: { fontSize: 12, fontWeight: '700', color: Colors.brand, marginTop: 'auto', paddingTop: 12, fontFamily: Fonts.bold },

  privacy: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 24 },
});
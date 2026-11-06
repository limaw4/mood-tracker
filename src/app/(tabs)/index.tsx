import AppHeader, { HeaderIcon } from '@/components/AppHeader';
import { DEFAULT as Colors } from '@/constants/Colors';
import { periodImages } from '@/libs/period-images';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// --- Mock data (replace with real data later) ---
const couple = { me: 'Ize', partner: 'Lim', days: 248 };
const note = {
  text: 'No need to have it all figured out. I\'m in your corner, always.',
  time: '12:42 PM',
};
// Drop your illustration in assets/images and swap this line:
// const heroImage: ImageSourcePropType | null = require('@/assets/images/our-place.png');
const heroImage: ImageSourcePropType | null = null;

type IconName = keyof typeof Ionicons.glyphMap;

const tiles: { id: string; title: string; sub: string; icon: IconName; bg: string; fg: string }[] = [
  { id: 'reset', title: 'A gentle reset', sub: 'Ideas for your mood', icon: 'sparkles-outline', bg: Colors.lavender, fg: Colors.lavenderText },
  { id: 'keepsakes', title: 'Our keepsakes', sub: '1 little surprise inside', icon: 'images-outline', bg: Colors.peach, fg: Colors.peachText },
];

function getPeriod() {
  const h = new Date().getHours();
  if (h < 12) return { name: 'morning', image: periodImages.morning };
  if (h < 18) return { name: 'afternoon', image: periodImages.afternoon };
  return { name: 'evening', image: periodImages.evening };
}

export default function HomeScreen() {
  const router = useRouter();
  const period = getPeriod();
  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase();

  return (
    <View style={styles.container}>
      <AppHeader
        brand
        right={
          <View style={styles.headerRight}>
            <Text style={styles.date}>{today}</Text>
            <HeaderIcon name="notifications-outline" />
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>A little closer, every day.</Text>

        {/* HERO: shared space */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroNames}>{couple.me.toUpperCase()} + {couple.partner.toUpperCase()}</Text>
            <Text style={styles.heroDays}>{couple.days} days of us ♡</Text>
          </View>
          {heroImage ? (
            <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Text style={{ fontSize: 56 }}>🛋️</Text>
            </View>
          )}
          <View style={styles.heroBottom}>
            <Text style={styles.heroCaption}>Your little place. Just you two.</Text>
            <Ionicons name="pencil-outline" size={18} color={Colors.brand} />
          </View>
        </View>

        {/* CHECK-IN */}
        <View style={styles.checkIn}>
          <View style={styles.checkInRow}>
            <View style={styles.weatherBubble}>
              <Image source={period.image} style={styles.weatherIcon} resizeMode="contain" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkInTitle}>How's your heart, {couple.me}?</Text>
              <Text style={styles.checkInSub}>Your {period.name} check-in is here.</Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [styles.checkInButton, pressed && { opacity: 0.85 }]}
            onPress={() => router.push('/moods')}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.checkInButtonText}>Take a moment for you</Text>
          </Pressable>
        </View>

        {/* NOTE */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteLabel}>A LITTLE NOTE FROM {couple.partner.toUpperCase()}</Text>
            <Ionicons name="heart-outline" size={20} color={Colors.brand} />
          </View>
          <Text style={styles.noteText}>"{note.text}"</Text>
          <View style={styles.noteFooter}>
            <Text style={styles.noteMeta}>Sent with love · {note.time}</Text>
            <Pressable hitSlop={8} onPress={() => {}}>
              <Text style={styles.noteAction}>Send a hug ♡</Text>
            </Pressable>
          </View>
        </View>

        {/* LITTLE THINGS */}
        <Text style={styles.sectionTitle}>Little things for us</Text>
        <View style={styles.tiles}>
          {tiles.map((t) => (
            <Pressable
              key={t.id}
              style={({ pressed }) => [styles.tile, { backgroundColor: t.bg }, pressed && { opacity: 0.85 }]}
              onPress={() => {}}
            >
              <Ionicons name={t.icon} size={24} color={t.fg} />
              <View>
                <Text style={styles.tileTitle}>{t.title}</Text>
                <Text style={styles.tileSub}>{t.sub}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const cardShadow = {
  shadowColor: '#B34F78',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 2,
} as const;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  date: { fontSize: 12, letterSpacing: 1, color: Colors.textSecondary },

  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: Colors.brand,
    marginTop: 8,
    marginBottom: 18,
  },

  hero: { backgroundColor: Colors.backgroundCard, borderRadius: 24, overflow: 'hidden', marginBottom: 16, ...cardShadow },
  heroTop: {
    backgroundColor: Colors.lavender,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  heroNames: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: Colors.lavenderText },
  heroDays: { fontSize: 11, color: Colors.lavenderText },
  heroImage: { width: '100%', height: 190 },
  heroPlaceholder: { backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  heroCaption: { fontSize: 13, color: Colors.textPrimary },

  checkIn: { backgroundColor: Colors.blush, borderRadius: 24, padding: 20, marginBottom: 16 },
  checkInRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  weatherBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: { width: 32, height: 32 },
  checkInTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  checkInSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.brand,
    borderRadius: 999,
    paddingVertical: 15,
  },
  checkInButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  noteCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  noteLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: Colors.brand },
  noteText: { fontSize: 20, lineHeight: 28, fontWeight: '500', color: Colors.textPrimary },
  noteFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  noteMeta: { fontSize: 12, color: Colors.textSecondary },
  noteAction: { fontSize: 13, fontWeight: '700', color: Colors.brand },

  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  tiles: { flexDirection: 'row', gap: 12 },
  tile: { flex: 1, minHeight: 120, borderRadius: 22, padding: 16, justifyContent: 'space-between' },
  tileTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  tileSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});

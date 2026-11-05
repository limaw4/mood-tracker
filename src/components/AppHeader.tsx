import { DEFAULT as Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title?: string; // centered title (for inner screens)
  brand?: boolean; // show "LITTLE US" on the left (Home)
  showBack?: boolean; // show the back arrow on the left
  right?: ReactNode; // anything on the right: date, bell, etc.
};

export default function AppHeader({ title, brand, showBack, right }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[style.container, { paddingTop: insets.top + 8 }]}>
      <View style={style.left}>
        {brand ? (
          <Text style={style.brandText}>LITTLE US</Text>
        ) : showBack && router.canGoBack() ? (
          <HeaderIcon name="arrow-back" onPress={() => router.back()} />
        ) : null}
      </View>

      {title ? <Text style={style.title}>{title}</Text> : <View style={{ flex: 1 }} />}

      <View style={style.right}>{right}</View>
    </View>
  );
}

export function HeaderIcon({
  name,
  onPress,
}: {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={style.iconButton}>
      <Ionicons name={name} size={22} color={Colors.brand} />
    </Pressable>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  left: { minWidth: 44, alignItems: 'flex-start' },
  right: { minWidth: 44, alignItems: 'flex-end' },
  brandText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: Colors.brand,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  iconButton: { padding: 4 },
});
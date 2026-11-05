import { DEFAULT as Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home-outline' },
  { name: 'moods', title: 'Moods', icon: 'happy-outline' },
  { name: 'for-us', title: 'For us', icon: 'heart-circle-outline' },
  { name: 'memories', title: 'Memories', icon: 'images-outline' },
];

function TabLabel({ title, focused, color }: { title: string; focused: boolean; color: string }) {
  return (
    <View style={styles.labelWrap}>
      <Text style={[styles.label, { color, fontWeight: focused ? '700' : '500' }]}>{title}</Text>
      <View style={[styles.dot, { opacity: focused ? 1 : 0 }]} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.outline,
        },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, size }) => <Ionicons name={t.icon} size={size} color={color} />,
            tabBarLabel: ({ color, focused }) => (
              <TabLabel title={t.title} focused={focused} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  labelWrap: { alignItems: 'center', gap: 3 },
  label: { fontSize: 11 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.brand },
});
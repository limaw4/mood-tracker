import { DEFAULT as Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ColorValue } from 'react-native';
import { HomeIcon, MoodIcon, HeartHandshakeIcon, GalleryIcon } from '@/components/Icons';

type IconComponent = React.ComponentType<{ size?: number; color?: ColorValue }>;

const TABS: { name: string; title: string; Icon: IconComponent }[] = [
  { name: 'index', title: 'Home', Icon: HomeIcon },
  { name: 'moods', title: 'Moods', Icon: MoodIcon },
  { name: 'for-us', title: 'For us', Icon: HeartHandshakeIcon },
  { name: 'memories', title: 'Memories', Icon: GalleryIcon },
];

function TabLabel({ title, focused, color }: { title: string; focused: boolean; color: ColorValue }) {
  return (
    <View style={styles.labelWrap}>
      <Text style={[styles.label, { color: color || Colors.textSecondary, fontFamily: focused ? Fonts.bold : Fonts.medium }]}>{title}</Text>
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
            tabBarIcon: ({ color, size }) => <t.Icon size={size} color={(color as ColorValue) || Colors.textSecondary} />,
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
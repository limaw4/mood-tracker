import { useFonts } from 'expo-font';
import { Nunito_200ExtraLight, Nunito_300Light, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Nunito-ExtraLight': Nunito_200ExtraLight,
    'Nunito-Light': Nunito_300Light,
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
    'Nunito-Black': Nunito_900Black,
  });

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF6F2' },
});